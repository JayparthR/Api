const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample database of 1,000+ New Zealand junk car prices
const carPrices = [];

function generateCarData() {
    const makers = ["Toyota", "Honda", "Nissan", "Ford", "Mazda", "Hyundai", "Subaru", "Volkswagen"];
    const models = ["Corolla", "Civic", "Altima", "Focus", "Mazda3", "i30", "Impreza", "Golf"];
    const conditions = ["good", "damaged", "scrap"];
    const runningStates = ["yes", "no"];

    for (let i = 0; i < 1000; i++) {
        const maker = makers[Math.floor(Math.random() * makers.length)];
        const model = models[Math.floor(Math.random() * models.length)];
        const year = Math.floor(Math.random() * (2020 - 1990 + 1)) + 1990;
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const running = runningStates[Math.floor(Math.random() * runningStates.length)];

        // Generate estimated price
        let price = Math.floor(Math.random() * 3000) + 300; // Prices range from $300 to $3,000 NZD
        if (condition === "scrap") price = Math.floor(Math.random() * 800) + 300; // Scrap cars have lower value
        if (condition === "damaged") price = Math.floor(Math.random() * 1500) + 500; // Damaged cars have mid-range value

        carPrices.push({ maker, model, year, condition, running, price });
    }
}
generateCarData();

// API Route for estimating car price
app.get("/get-car-price", (req, res) => {
    const { maker, model, year, condition, running } = req.query;
    const yearNum = parseInt(year);

    // Find a matching car price
    const car = carPrices.find(c =>
        c.maker.toLowerCase() === maker.toLowerCase() &&
        c.model.toLowerCase() === model.toLowerCase() &&
        c.year === yearNum &&
        c.condition === condition &&
        c.running === running
    );

    if (car) {
        res.json({ success: true, estimated_price: `$${car.price} NZD` });
    } else {
        res.json({ success: false, message: "No price found for this car. Try different details." });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
