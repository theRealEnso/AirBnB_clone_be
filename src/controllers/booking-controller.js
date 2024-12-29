import dotenv from "dotenv"
dotenv.config();

import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res, next) => {
    try {
        const {amount, currency} = req.body;

        const amountInCents = Math.round(amount * 100);
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency,
        });

        res.status(200).json({
            client_secret: paymentIntent.client_secret,
        })
    } catch(error){
        next(error);
    };
};