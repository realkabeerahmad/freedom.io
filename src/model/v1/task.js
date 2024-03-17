const createTaskTable = `
    CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        task_id VARCHAR(255) NOT NULL,
        allow BOOLEAN DEFAULT FALSE,
        read BOOLEAN DEFAULT FALSE,
        delete BOOLEAN DEFAULT FALSE,
        edit BOOLEAN DEFAULT FALSE,
        update BOOLEAN DEFAULT FALSE
    )
`;
module.exports = createTaskTable;
