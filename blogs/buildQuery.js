const buildFilterQuery = (enabledFilters) => {
    const usedFilter = {
        where: {
            AND: []
        }
    };




    if (enabledFilters.filters) {

        /*
                Filters would look like this : 

                {
                    "filter1":["a","b"],
                    "filter2":["a"]
                }
            */


        // First, we'll loop through the key inside enabledFilters . filters

        // IT'S IMPORTANT THAT key of these filter object, reflect to the column in our database !
        for (const key in enabledFilters.filters) {

            // We'll store the filter values (array of value that we want to be inside where clause, to make the code more readable)
            const filterValues = enabledFilters.filters[key];



            /* In this part we'll include relational filter as well, such as user.fullName or user.username
                It's because, prisma support this, the where clause will looks like : 

                where:{
                    relation:{
                        column : "value"
                    }
                }
            
            */
            if (key.includes(".")) {
                let [relation, column] = key.split(".");

                /*If values array length is just 1 , we'll just filter for exact match 

                 Pretty much like : 
                
                    prisma.blog.findMany({
                        where:{
                            relation:{
                                column: "value"
                            }
                        }
                    })

                */

                if (filterValues.length === 1) {
                    usedFilter.where.AND.push({
                        [`${relation}`]: {
                            [`${column}`]: filterValues,
                        },
                    });
                }

                /*But if values array length is more than 1 , we'll filter with `in` operator

                 Pretty much like : 
                
                    prisma.blog.findMany({
                        where:{
                            relation:{
                                column: {
                                    in : ["value1", "value2"]
                                }
                            }
                        }
                    })

                */
                else {
                    usedFilter.where.AND.push({
                        [`${relation}`]: {
                            [`${column}`]: { in: filterValues,
                            },
                        },
                    });
                }
            }
            /* This next part, is for filtering column that is available in our table 

                where:{
                    column:"value"
                }
            
            */
            else {
                if (filterValues.length === 1) {
                    usedFilter.where.AND.push({
                        [`${key}`]: filterValues[0]
                    })
                } else {
                    usedFilter.where.AND.push({
                        [`${key}`]: { in: filterValues,
                        },
                    });
                }
            }
        }
    }

    if (enabledFilters.searchKey && enabledFilters.searchValue) {
        /*
            Same logic as filter applied here, if the searchKey include ".", then it means we are searching based on relation
        */
        if (enabledFilters.searchKey.includes(".")) {
            let [relation, column] = enabledFilters.searchKey.split(".");
            usedFilter.where.AND.push({
                [`${relation}`]: {
                    [`${column}`]: {
                        contains: `${enabledFilters.searchValue}`,
                    },
                },
            });
        } else {
            usedFilter.where.AND.push({
                [`${enabledFilters.searchKey}`]: {
                    contains: `${enabledFilters.searchValue}`,
                },
            });
        }
    }



    return usedFilter;
}

module.exports = {
    buildFilterQuery
}