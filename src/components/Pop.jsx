import React, { useState } from 'react';
import { graph as PopotoGraph, queryviewer as PopotoQueryViewer, result as PopotoResult, tools as PopotoTools } from 'popoto';
import neo4j from 'neo4j-driver';

const Pop = ({ cypher }) => {
  const [graphData, setGraphData] = useState(null);
  const [queryResult, setQueryResult] = useState(null);

  async function runCypher(cypher) {
    const driver = neo4j.driver(
      'bolt://10.153.1.85:7687',
      neo4j.auth.basic('neo4j', 'neo4j1000')
    );
    const session = driver.session();
    const result = await session.run(cypher);
    const nodes = result.records.map((record) => record.get(0));
    const graphConfig = {
      nodes: nodes.map((node) => ({ label: node.labels[0], properties: node.properties })),
      relationships: result.records.map((record) => ({
        source: record.get(0).id,
        target: record.get(1).id,
        type: record.get(2).type,
        properties: record.get(2).properties,
      })),
      initial_cypher: cypher,
      popoverComponent: function (label, properties) {
        return (
          <div>
            {PopotoTools.appendFittedText(label)} {/* Use the appendFittedText component */}
            <PopotoTools.dataModel properties={properties} /> {/* Use the dataModel component */}
          </div>
        );
      },
    };
    const myGraph = new PopotoGraph(graphConfig);
    setGraphData(myGraph);
    setQueryResult(result);
    session.close();
  }

  if (graphData) {
    return (
      <div>
        <PopotoGraph graph={graphData} />
        <PopotoQueryViewer graph={graphData} />
        {queryResult && <PopotoResult result={queryResult} />}
      </div>
    );
  }

  return (
    <div>
      <textarea value={cypher} onChange={(e) => runCypher(e.target.value)} />
      <button onClick={() => runCypher(cypher)}>Run Cypher</button>
    </div>
  );
};

export default Pop;
