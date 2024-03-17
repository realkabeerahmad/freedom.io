const createRoleTaskTable = `
    CREATE TABLE role_tasks (
        id SERIAL PRIMARY KEY,
        role_id INT REFERENCES roles(id),
        task_id INT REFERENCES tasks(id),
        allow BOOLEAN DEFAULT FALSE,
        read BOOLEAN DEFAULT FALSE,
        delete BOOLEAN DEFAULT FALSE,
        edit BOOLEAN DEFAULT FALSE,
        update BOOLEAN DEFAULT FALSE
    )
`;
module.exports = createRoleTaskTable;
