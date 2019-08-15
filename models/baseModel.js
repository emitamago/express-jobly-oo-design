// /** Company class for jobly */
const db = require("../db");
const sqlForPartialUpdate = require("../helpers/partialUpdate")

/** simpler version that has overriden methods that call super with what they need */
class User extends Model {
    static async create({fields}) {
        super.create("users", fields, ["id", "firstName", "lastName"])
    }
}

/** fancier version that uses class attributes and may not even need overridden methods */
class User2 extends Models {
    // "class attributes on this table"
    static tableName = "users";
    static publicFields = ["id", "firstName", "lastName"];

    // don't need to make create --

    search() { }

}

class Model {
    /**create new records 
     * Return  { } */

     // create("users", {firstName: " Joel", lastName: "Burton"}, ["id", "firstName", "lastName"])
    static async create(tableName, fieldsAndValues, returnFieldNames) {
        // check for duplicate company by searching for pk, if found throw error
        try {
            var tableName = this.tableName;
            var fieldNames = Object.keys(fields).join(", ");
            var returningFields = returnFieldNames.join(", ");

            const result = await db.query(
                `INSERT INTO ${tableName} (${fields})
            VALUES (###number of pair  + $ sign)
             RETURNING ${fields}`,
                [$fileds.values]);

            return result.rows[0];
        } catch (error) {
            // Is there best way to standardize error format??
            return next
        }
    }

    // static async create({ fields }) {
    //     // check for duplicate company by searching for pk, if found throw error
    //     try {
    //         const result = await db.query(
    //             `INSERT INTO ${tableName} (${fields})
    //         VALUES (###number of pair  + $ sign)
    //          RETURNING ${fields}`,
    //             [$fileds.values]);

    //         return result.rows[0];
    //     } catch (error) {
    //         // Is there best way to standardize error format??
    //         return next
    //     }
    // }

    /** get all records*/
    static async getAll() {
        let results = await db.query(`SELECT ${pk, name} FROM companies`);
        return results.rows;
    }

    /** Take query object from GET route and return any matching record 
     * based on the query 
     * Return [{ pk: ..., name: ... },,,]
    */

    static async getBySearch(query) {
        let baseQuery = `SELECT ${pk, name} FROM ${tablename}`;

        let values = Object.values(query);

        /**POSSIBLE TO MOVE TO ROUTE */
        // if (query.min_employees > query.max_employees) {
        //     const err = new Error(`Invalid query`);
        //     err.status = 400;
        //     throw err;
        // }

        let whereClause = _createFinalWhereClause(query)
        let finalQuery = `${baseQuery} WHERE ${whereClause}`;

        let results = await db.query(finalQuery, values);

        if (results.rows.length === 0) {
            const err = new Error(`No matching  ${record_name}.`);
            err.status = 404;
            throw err;
        }
        return results.rows;
    }


    /** Return specific record based on pk*/
    static async getOne(pk) {
        let result = await db.query(
            `SELECT ${fields}
            FROM ${tableName}
            WHERE pk=$1`,
            [pk]);

        if (result.rows.length === 0) {
            const err = new Error(`No ${record_name} found.`);
            err.status = 404;
            throw err;

        }
        return result.rows[0];
    }

    /** Update existing record with any provided data */
    static async update(pk, data) {
        let { query, values } = sqlForPartialUpdate(tableName, data, pk, pkvalue)
        let result = await db.query(query, values);
        if (result.rows.length === 0) {
            const err = new Error(`No ${tableName} found`);
            err.status = 404;
            throw err;
        }
        return result.rows[0]
    }

    /**Delete specific record based on pk */
    static async remove(pk) {
        const result = await db.query(
            `DELETE FROM ${tableName} 
                WHERE pk = $1 
                RETURNING pk`,
            [pk]);

        if (result.rows.length === 0) {
            const err = new Error(`No companies with the pk`);
            err.status = 404;
            throw err;
        }
        return result.rows[0];
    }

    /** accepts query string object and generates WHERE clause for SQL */
    static createFinalWhereClause(query) {
        let idx = 1;
        let buildClause = [];
        
        for (let key in query) {
            let whereClause = this.createSIngleWhereClause(key, idx++)
            buildClause.push(whereClause);
        }
        let finalWhereClause = buildClause.join(` AND `);
        
        return finalWhereClause;
    }
}

/**NEED TO BE SUB CLASS SPECIFIC */
/** accepts a key/query term and creates a single WHERE clause according to the key */
function createWhereClause(key, idx) {
    if (key === 'name') {
        let whereClauseName = `name ILIKE $${idx}`;
        return whereClauseName;

    } else if (key === "min_employees") {
        let whereClauseMin = `num_employees>=$${idx}`;
        return whereClauseMin;

    } else {
        let whereClauseMax = `num_employees<=$${idx}`
        return whereClauseMax;
    }
}



module.exports = Model






