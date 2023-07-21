import createInstance from "./axiosApi";

const handlePayment = async () => {
    try {
        const token = localStorage.getItem('token');

        const axiosInstance = createInstance(token);

        const response = await axiosInstance.post('/create-order', { amount: 59900 }); // Amount in paise (1000 paise = 10 INR)
        const { data } = response;

        // Initialize the Razorpay payment widget
        const options = {
            key: 'rzp_test_UWN9YHKEBFWQUS',
            amount: 59900, // Amount in paise (1000 paise = 10 INR)
            currency: 'INR',
            name: 'Heart Beat',
            description: 'Test Payment',
            image: '', // Add your logo URL here
            order_id: data.id,
            handler: function (response) {
                // alert('Payment Successful!');
                 axiosInstance.patch('/premiumPurchase').then((res) => {
                    console.log(res.data);
                })
                // Handle successful payment (e.g., update the payment status in the database)
            },
            prefill: {
                name: 'Heart Beat',

            },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

        rzp1.on('payment.failed', function (response) {
            // alert('Payment Failed');
            // Handle failed payment
        });
    } catch (error) {
        console.error('Error creating order:', error.message);
    }
};

export default handlePayment;