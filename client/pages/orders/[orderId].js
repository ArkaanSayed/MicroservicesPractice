import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';


const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
            // token: id,
        },
        onSuccess: () => Router.push('/orders')
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };
        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 100);

        // If the paremeter in use effect is an empty array 
        // The function return will act as a dispose method !!
        // Hence the interval will be cleared and the setInterval will not
        // invoke the findTimeLeft function !!
        return () => {
            clearInterval(timerId);
        }
    }, [order]);

    if (timeLeft < 0) {
        return <div>Order Expired</div>;
    }

    const msLeft = new Date(order.expiresAt) - new Date();
    return (<div>Time left to pay: {timeLeft} seconds
        <StripeCheckout token={({ id }) => doRequest({ token: id })}
            stripeKey="pk_test_51NajN5SHtsB3GF2a1w6IKWDrCwMPeB1OLsqIoFOC64Rh24ubTabtlLX8CjvihxmXowFPX6IlTyQWPES3qDwS6YVU00qxJumAhZ"
            amount={order.ticket.price * 100}
            email={currentUser.email}
        />
        {errors}
    </div>)
}


OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
}

export default OrderShow;