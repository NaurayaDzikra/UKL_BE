const orderModel = require('../models/index').order_lists;
const detailModel = require('../models/index').order_details;
const foodModel = require('../models/index').foods;

exports.Addorder = async (request, response) => { //Mendefinisikan endpoint untuk membuat pesan baru
  try {
    const { customer_name, table_number, order_date, order_detail } = request.body; //Mendapatkan data pesanan dari body request 

    //Membuat pesanan baru dengan menggunakan model order_list
    const orderList = await orderModel.create({
      customer_name,
      table_number,
      order_date
    });
    
    //Menyiapkan Array untuk menyimpan detail pesanan
    const orderDetails = [order_detail]; 
    //Iterasi melalui setiap item dalam order_Detail untuk membuat detail pesanan
    for (const item of order_detail) {
      const { food_id, price, quantity } = item;

      //detail pesanan
      const detail = await detailModel.create({
        order_id: orderList.order_id, // Gunakan ID pesanan yang baru saja dibuat
        food_id: food_id,
        price: price,
        quantity: quantity
      });
      orderDetails.push(detail);
    }

    // Kirim respons berhasil
    return response.status(201).json({
      success: true,
      Data: {
        order_id: orderList.order_id, // Gunakan ID pesanan yang baru saja dibuat
        orderList,
        order_details: detailModel
      },
      message: "Order list has been created"
    });
  } catch (error) {
    // Tangani kesalahan
    return response.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getAllHistory = async (req, res) => {
  try {

    let orders = await orderModel.findAll({
      include: [{
        model: detailModel,
        as: 'order_detail',
        include: [foodModel]
      }]
    });
    console.log(orders)

    return res.json({
      success: true,
      data: orders,
      message: 'Order list has been retrieved along with order details'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }


}