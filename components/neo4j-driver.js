let neo4j = require("neo4j-driver");

export class Driver {
  constructor() {
    const uri = "neo4j+s://e84d7856.databases.neo4j.io";
    const username = "neo4j";
    const password = "a3kQRDpmRmpebE4fnZYQJdciO0VM_ukGeyrubapdh-U";

    this.driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
  }

  async close_driver() {
    await this.driver.close();
  }
  /*
  cypher_query: use '$variable' within the query.
  properties: include the 'variable' (no '$')
  
  example:
  query: MERGE (n:user {name: $id}) RETURN n
  property: { id }
  */

  async run_cypher_query(cypher_query, properties) {
    let session = this.driver.session();
    const data = await session.run(cypher_query, properties);
    session.close();

    return data;
  }

  add_user(user) {
    const query = `MERGE (user:User {name: $user})
                   ON CREATE SET user.id=apoc.create.uuid()
                   RETURN user.id`;

    this.run_cypher_query(query, { user });
  }

  add_stroke(user_id) {
    const query = `
      MATCH (user:User {id: $user_id})
      MATCH (x:X {value: 0})
      MATCH (y:Y {value: 0})
      MATCH (angle:Angle {value: 0})
      CREATE (user) - [point:Point {index: 0, time: 0}] -> (x)
      ON CREATE SET point.id=apoc.create.uuid()
      CREATE (user) - [point] -> (y)
      CREATE (user) - [point] -> (angle)`;

    this.run_cypher_query(query, { user_id });
  }
}
