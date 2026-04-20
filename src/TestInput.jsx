import { useState } from "react";

export default function TestInput() {
  const [value, setValue] = useState("");

  return (
    <div style={{ padding: 40 }}>
      <h1>Prueba de input aislado</h1>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        style={{
          width: "300px",
          padding: "10px",
          fontSize: "20px",
          border: "1px solid #ccc"
        }}
      />

      <p>Valor: {value}</p>
    </div>
  );
}
 