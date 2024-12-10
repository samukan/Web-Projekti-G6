// src/controllers/orderController.ts

/**
 * @api {post} /api/orders Place Order
 * @apiName PlaceOrder
 * @apiGroup Order Controller
 * @apiUse UserAuth
 *
 * @apiBody {Object[]} items Order items
 * @apiBody {Number} items.product_id Product ID
 * @apiBody {Number} items.quantity Quantity
 * @apiBody {String} delivery_method "pickup" or "delivery"
 * @apiBody {String} [delivery_address] Required for delivery
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "items": [
 *         {
 *           "product_id": 1,
 *           "quantity": 2
 *         }
 *       ],
 *       "delivery_method": "delivery",
 *       "delivery_address": "Example Street 123"
 *     }
 *
 * @apiSuccess {Object} order Created order
 * @apiSuccess {Number} order.id Order ID
 * @apiSuccess {String} order.status Initial status
 *
 * @apiError (400) ValidationError Invalid input data
 * @apiError (401) Unauthorized Not authenticated
 * @apiError (500) DatabaseError Order creation failed
 */

/**
 * @api {get} /api/orders Get Orders
 * @apiName GetOrders
 * @apiGroup Order Controller
 * @apiUse AdminAuth
 *
 * @apiSuccess {Object[]} orders List of orders
 * @apiSuccess {Number} orders.id Order ID
 * @apiSuccess {String} orders.status Status
 * @apiSuccess {Object[]} orders.items Order items
 *
 * @apiError (401) Unauthorized Admin access required
 * @apiError (500) DatabaseError Query failed
 */

/**
 * @api {put} /api/orders/:id/status Update Order Status
 * @apiName UpdateOrderStatus
 * @apiGroup Order Controller
 * @apiUse AdminAuth
 *
 * @apiParam {Number} id Order ID
 * @apiBody {String} status New status
 *
 * @apiSuccess {Object} response Update result
 * @apiSuccess {String} response.message Success message
 * @apiSuccess {String} response.newStatus Updated status
 *
 * @apiError (400) InvalidStatus Invalid status transition
 * @apiError (404) NotFound Order not found
 */

import {Request, Response, NextFunction} from 'express';
import pool from '../utils/db';

interface AuthenticatedRequest extends Request {
  user?: {userId: number; role: number};
}

const statusTransitions: {[key: string]: string[]} = {
  Vastaanotettu: ['Valmistuksessa'],
  Valmistuksessa: [
    'Tilaus on noudettavissa ravintolasta',
    'Tilaus on kuljetuksessa',
  ],
  'Tilaus on noudettavissa ravintolasta': ['Asiakas noutanut tilauksen'],
  'Tilaus on kuljetuksessa': ['Kuljetettu perille'],
  'Asiakas noutanut tilauksen': [], // Arkistointi tapahtuu automaattisesti
  'Kuljetettu perille': [], // Arkistointi tapahtuu automaattisesti
};

export const placeOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {customer, items, delivery_method, delivery_address} = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res
        .status(401)
        .json({message: 'Sinun täytyy kirjautua sisään tehdäksesi tilauksen.'});
      return;
    }

    if (!customer || !items || items.length === 0) {
      res.status(400).json({message: 'Virheelliset tilauksen tiedot'});
      return;
    }

    let status = 'Vastaanotettu';
    let addressValue: string | null = null;
    let method = 'pickup';

    if (delivery_method === 'delivery') {
      method = 'delivery';
      if (!delivery_address || delivery_address.trim() === '') {
        res
          .status(400)
          .json({message: 'Toimitusosoite puuttuu kotikuljetusta varten.'});
        return;
      }
      addressValue = delivery_address.trim();
      // Status voidaan jättää 'Vastaanotettu' koska jatketaan Valmistuksessa -> Kuljetuksessa jne.
    } else {
      // Jos pickup
      method = 'pickup';
      // Vastaanotettu on ok tässä vaiheessa
      addressValue = null;
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Lisää tilaus Orders-tauluun
      const [orderResult] = await connection.query(
        'INSERT INTO Orders (user_id, customer_name, order_date, status, delivery_address, delivery_method) VALUES (?, ?, NOW(), ?, ?, ?)',
        [userId, customer, status, addressValue, method]
      );

      const orderId = (orderResult as any).insertId;

      // Haetaan jokaiselle tuotteelle item_id MenuItems-taulusta tuotteen nimen perusteella
      const orderItemsRows: any[] = [];
      for (const item of items) {
        const [menuRows]: any[] = await connection.query(
          'SELECT item_id FROM MenuItems WHERE name = ?',
          [item.product]
        );
        if (menuRows.length === 0) {
          await connection.rollback();
          res
            .status(400)
            .json({message: `Tuotetta '${item.product}' ei löytynyt`});
          return;
        }
        const itemId = menuRows[0].item_id;
        orderItemsRows.push([orderId, itemId, item.quantity, item.price]);
      }

      await connection.query(
        'INSERT INTO OrderItems (order_id, item_id, quantity, price) VALUES ?',
        [orderItemsRows]
      );

      await connection.commit();

      res.status(201).json({message: 'Tilaus vastaanotettu', orderId});
    } catch (error) {
      await connection.rollback();
      console.error('Transaktio epäonnistui:', error);
      res.status(500).json({message: 'Tilauksen tallentaminen epäonnistui'});
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Virhe tilauksen käsittelyssä:', error);
    next(error);
  }
};

export const getOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user?.role !== 1) {
      res.status(403).json({error: 'Ei oikeuksia.'});
      return;
    }

    const [orders] = await pool.query(
      `SELECT o.order_id, o.customer_name, o.order_date, o.status,
              o.delivery_method, o.delivery_address, o.is_archived,
              GROUP_CONCAT(
                JSON_OBJECT(
                  'product', m.name,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'dietary_info', m.dietary_info
                )
              ) AS items
       FROM Orders o
       JOIN OrderItems oi ON o.order_id = oi.order_id
       JOIN MenuItems m ON oi.item_id = m.item_id
       WHERE o.is_archived = 0
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`
    );

    const formattedOrders = (orders as any[]).map((order) => ({
      order_id: order.order_id,
      customer_name: order.customer_name,
      order_date: order.order_date,
      status: order.status,
      delivery_method: order.delivery_method,
      delivery_address: order.delivery_address,
      is_archived: order.is_archived,
      items: JSON.parse(`[${order.items}]`),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Virhe tilauksia haettaessa:', error);
    next(error);
  }
};

// Päivittää tilauksen statuksen
export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = req.params.id;
    const {status} = req.body;
    const userRole = req.user?.role;

    // Hae nykyinen tila
    const [currentOrderRows] = await pool.query(
      'SELECT status FROM Orders WHERE order_id = ?',
      [orderId]
    );
    const currentOrder = (currentOrderRows as any)[0];

    if (!currentOrder) {
      res.status(404).json({message: 'Tilausta ei löytynyt.'});
      return;
    }

    const currentStatus = currentOrder.status;

    // Määritä sallitut tilasiirtymät roolin perusteella
    let allowedTransitions: string[] = [];

    if (userRole === 1) {
      // Admin-käyttäjä: sallitut tilasiirtymät
      allowedTransitions = statusTransitions[currentStatus] || [];
    } else if (userRole === 3) {
      // Kuljettaja: sallitaan vain siirtymä 'Tilaus on kuljetuksessa' -> 'Kuljetettu perille'
      if (
        currentStatus === 'Tilaus on kuljetuksessa' &&
        status === 'Kuljetettu perille'
      ) {
        allowedTransitions = ['Kuljetettu perille'];
      } else {
        res.status(403).json({
          message: 'Sinulla ei ole oikeutta muuttaa tilausta tähän tilaan.',
        });
        return;
      }
    } else {
      // Muut roolit: kielletty
      res.status(403).json({
        message: 'Sinulla ei ole oikeutta päivittää tilausta.',
      });
      return;
    }

    if (!allowedTransitions.includes(status)) {
      res.status(400).json({
        message: `Tilauksen tila ei voi muuttua tilasta "${currentStatus}" tilaan "${status}".`,
      });
      return;
    }

    // Päivitä tilauksen status ja arkistointi tarvittaessa
    const isArchived =
      status === 'Kuljetettu perille' || status === 'Asiakas noutanut tilauksen'
        ? 1
        : 0;

    await pool.query(
      'UPDATE Orders SET status = ?, is_archived = ? WHERE order_id = ?',
      [status, isArchived, orderId]
    );

    res.json({
      message: 'Tilauksen tila päivitetty onnistuneesti.',
      newStatus: status,
    });
  } catch (error) {
    console.error('Virhe tilauksen statusta päivitettäessä:', error);
    next(error);
  }
};

// Poistaa tilauksen
export const deleteOrder = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orderId = req.params.id;

    if (!orderId) {
      res.status(400).json({message: 'Tilaus ID puuttuu'});
      return;
    }

    // Varmistetaan, että tilaus löytyy
    const [orderRows] = await pool.query(
      'SELECT * FROM Orders WHERE order_id = ?',
      [orderId]
    );

    if ((orderRows as any).length === 0) {
      res.status(404).json({message: 'Tilausta ei löytynyt'});
      return;
    }

    // Aloitetaan transaktio
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Poistetaan tilausrivit OrderItems-taulusta
      await connection.query('DELETE FROM OrderItems WHERE order_id = ?', [
        orderId,
      ]);

      // Poistetaan tilaus Orders-taulusta
      await connection.query('DELETE FROM Orders WHERE order_id = ?', [
        orderId,
      ]);

      await connection.commit();

      res.json({message: 'Tilaus peruutettu onnistuneesti'});
    } catch (error) {
      await connection.rollback();
      console.error('Transaktio epäonnistui:', error);
      res.status(500).json({message: 'Tilauksen peruutus epäonnistui'});
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Virhe tilauksen poistamisessa:', error);
    next(error);
  }
};

// Hakee asiakkaan omat tilaukset
export const getCustomerOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        message: 'Sinun täytyy kirjautua sisään nähdäksesi tilauksesi.',
      });
      return;
    }

    // Haetaan tilaukset ja niiden tilausrivit käyttäjälle
    const [orders] = await pool.query(
      `SELECT o.order_id, o.customer_name, o.order_date, o.status,
              o.delivery_method, o.delivery_address,
              GROUP_CONCAT(
                JSON_OBJECT(
                  'product', m.name,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'dietary_info', m.dietary_info
                )
              ) AS items
       FROM Orders o
       JOIN OrderItems oi ON o.order_id = oi.order_id
       JOIN MenuItems m ON oi.item_id = m.item_id
       WHERE o.user_id = ?
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`,
      [userId]
    );
    // Muokataan data helpommin käsiteltävään muotoon.
    const formattedOrders = (orders as any[]).map((order) => ({
      order_id: order.order_id,
      customer_name: order.customer_name,
      order_date: order.order_date,
      status: order.status,
      delivery_method: order.delivery_method,
      delivery_address: order.delivery_address,
      items: JSON.parse(`[${order.items}]`),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Virhe tilauksia haettaessa:', error);
    next(error);
  }
};

// Hakee arkistoidut tilaukset adminille
export const getArchivedOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Varmistetaan, että käyttäjä on admin
    if (req.user?.role !== 1) {
      res
        .status(403)
        .json({message: 'Ei oikeuksia nähdä arkistoituja tilauksia'});
      return;
    }

    const [orders] = await pool.query(
      `SELECT o.order_id, o.customer_name, o.order_date, o.status,
              o.delivery_method, o.delivery_address, o.is_archived,
              GROUP_CONCAT(
                JSON_OBJECT(
                  'product', m.name,
                  'quantity', oi.quantity, 
                  'price', oi.price,
                  'dietary_info', m.dietary_info
                )
              ) AS items
       FROM Orders o
       JOIN OrderItems oi ON o.order_id = oi.order_id
       JOIN MenuItems m ON oi.item_id = m.item_id
       WHERE o.is_archived = 1
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`
    );

    const formattedOrders = (orders as any[]).map((order) => ({
      order_id: order.order_id,
      customer_name: order.customer_name,
      order_date: order.order_date,
      status: order.status,
      delivery_method: order.delivery_method,
      delivery_address: order.delivery_address,
      is_archived: order.is_archived,
      items: JSON.parse(`[${order.items}]`),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Virhe arkistoitujen tilauksia haettaessa:', error);
    next(error);
  }
};

// Hakee "Kuljetuksessa" olevat tilaukset kuljettajille
export const getDeliveryOrders = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Varmistetaan, että käyttäjä on kuljettaja (rooli 3)
    if (req.user?.role !== 3) {
      res
        .status(403)
        .json({message: 'Ei oikeuksia nähdä toimitettavia tilauksia'});
      return;
    }
    const [orders] = await pool.query(
      `SELECT o.order_id, o.customer_name, o.order_date, o.status,
              o.delivery_method, o.delivery_address,
              GROUP_CONCAT(
                JSON_OBJECT(
                  'product', m.name,
                  'quantity', oi.quantity,
                  'price', oi.price,
                  'dietary_info', m.dietary_info
                )
              ) AS items
       FROM Orders o
       JOIN OrderItems oi ON o.order_id = oi.order_id
       JOIN MenuItems m ON oi.item_id = m.item_id
       WHERE o.status = 'Tilaus on kuljetuksessa' AND o.is_archived = 0
       GROUP BY o.order_id
       ORDER BY o.order_date DESC`
    );

    const formattedOrders = (orders as any[]).map((order) => ({
      order_id: order.order_id,
      customer_name: order.customer_name,
      order_date: order.order_date,
      status: order.status,
      delivery_method: order.delivery_method,
      delivery_address: order.delivery_address,
      items: JSON.parse(`[${order.items}]`),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Virhe toimitettavia tilauksia haettaessa:', error);
    next(error);
  }
};
