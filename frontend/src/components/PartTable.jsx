return (
  <div>
    <h1>My Parts</h1>

    <table>
      <thead>
        <tr>
          <th>Part No</th>
          <th>Part Name</th>
          <th>Model</th>
          <th>Location</th>
          <th>Gap</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {parts.map((part) => (
          <tr key={part._id}>
            <td>{part.partNo}</td>
            <td>{part.partName}</td>
            <td>{part.model}</td>
            <td>{part.location}</td>
            <td>{part.gap}</td>
            <td>{part.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);