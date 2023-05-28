import React, { useState } from "react";
import "../../assets/css/Switch.css";
import "../../assets/css/ResponsiveTable.css";
import "../../assets/js/fontawesome.js";

// FORM COMPONENTS
import { Button } from "../Form/Button.jsx";
import { Switch } from "../Form/Switch";

export function Table(props) {
  const {
    headers,
    columns,
    data,
    edit,
    delete: showDelete,
    status,
    onStatusClick,
    onEditClick,
    onDeleteClick,
  } = props;

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
            {status && <th>Estado</th>}
            {edit && <th>Editar</th>}
            {showDelete && <th>Eliminar</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const [statusSlider, setStatus] = useState(row.status);

            const handleSwitchChange = () => {
              onStatusClick(row.id, statusSlider);
              setStatus((statusSlider) => !statusSlider);
            };

            return (
              <tr key={row.id}>
                {headers.map((header) => (
                  <td key={header}>{row[header]}</td>
                ))}
                {status && (
                  <td>
                    <Switch
                      change={() => handleSwitchChange()}
                      checked={statusSlider}
                    />
                  </td>
                )}
                {edit && (
                  <td>
                    <Button
                      color="warning"
                      type="button"
                      text={
                        <span className="icon">
                          <i className="fa-solid fa-pencil"></i>
                        </span>
                      }
                      action={() => onEditClick(row.id)}
                    />
                  </td>
                )}
                {showDelete && (
                  <td>
                    <Button
                      color="primary"
                      type="button"
                      text={
                        <span className="icon">
                          <i className="fa-solid fa-trash"></i>
                        </span>
                      }
                      action={() => onDeleteClick(row.id)}
                    />
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
