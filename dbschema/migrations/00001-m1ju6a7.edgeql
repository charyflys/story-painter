CREATE MIGRATION m1ju6a7azjfjhans3lhyovuxvlxhzu46axfkq7j74bqfjbk5m2wbpa
    ONTO initial
{
  CREATE TYPE default::Record {
      CREATE REQUIRED PROPERTY client: std::str;
      CREATE REQUIRED PROPERTY created_at: std::str;
      CREATE REQUIRED PROPERTY data: std::str;
      CREATE REQUIRED PROPERTY keyandPassword: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY note: std::str {
          SET default := '';
      };
      CREATE REQUIRED PROPERTY updated_at: std::str;
  };
};
