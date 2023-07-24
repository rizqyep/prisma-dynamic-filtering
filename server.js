const express = require("express");
const { getAll } = require("./blogs/blogService");


const app = express();



const checkFilteringQuery = (req) => {
    const enabledFilters = {};

    if (req.query.searchKey) {
        enabledFilters.searchKey = req.query.searchKey;
    }

    if (req.query.searchValue) {
        enabledFilters.searchValue = req.query.searchValue;
    }

    if (req.query.filters) {
        enabledFilters.filters = JSON.parse(req.query.filters);
    }


    if (req.query.orderKey) {
        enabledFilters.orderKey = req.query.orderKey;
    }

    if (req.query.orderRule) {
        enabledFilters.orderRule = req.query.orderRule;
    }


    if (req.query.page) {
        enabledFilters.page = req.query.page;
    }

    if (req.query.rows) {
        enabledFilters.rows = req.query.rows;
    }

    return enabledFilters
}



app.get("/blogs", async(req, res) => {
    const enabledFilters = checkFilteringQuery(req);

    const result = await getAll(enabledFilters);


    return res.status(200).json({
        data: result
    })
})

app.listen(3000, () => {
    console.log("[INFO] READY!!!")
})