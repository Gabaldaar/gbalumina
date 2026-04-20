export const contractTemplates = [
  {
    id: "portrait",
    name: "Contrato de Retrato / Book",
    fields: [
      { key: "eventDate", label: "Fecha de la sesión", type: "date" },
      { key: "eventLocation", label: "Lugar de la sesión", type: "text" },
      { key: "deliveryTime", label: "Tiempo de entrega (ej: 7 días)", type: "text" }
    ],
    content: `
CONTRATO DE SESIÓN FOTOGRÁFICA DE RETRATO

Entre {{photographerName}} (“el fotógrafo”) y {{clientName}} (“el cliente”) se acuerda lo siguiente:

1. La sesión fotográfica se realizará el día {{eventDate}} en {{eventLocation}}.
2. El fotógrafo entregará el material final dentro de un plazo de {{deliveryTime}}.
3. El cliente autoriza el uso de las imágenes para portafolio, redes sociales y promoción del fotógrafo, salvo acuerdo contrario por escrito.
4. El cliente garantiza que posee autorización para fotografiar a cualquier persona menor de edad presente en la sesión.
5. El fotógrafo conservará los derechos de autor sobre todas las imágenes producidas.
6. Cualquier modificación o solicitud adicional deberá acordarse por escrito.

Ambas partes aceptan los términos del presente acuerdo.
`
  },

  {
    id: "event",
    name: "Contrato de Fotografía de Eventos",
    fields: [
      { key: "eventDate", label: "Fecha del evento", type: "date" },
      { key: "eventLocation", label: "Lugar del evento", type: "text" },
      { key: "eventSchedule", label: "Horario (ej: 18:00 a 23:00)", type: "text" },
      { key: "deliveryTime", label: "Tiempo de entrega (ej: 15 días)", type: "text" }
    ],
    content: `
CONTRATO DE SERVICIO FOTOGRÁFICO PARA EVENTOS

Entre {{photographerName}} (“el fotógrafo”) y {{clientName}} (“el cliente”) se acuerda lo siguiente:

1. El servicio se realizará el día {{eventDate}} en {{eventLocation}}, en el horario {{eventSchedule}}.
2. El fotógrafo cubrirá el evento según lo acordado y entregará el material final dentro de un plazo de {{deliveryTime}}.
3. El cliente autoriza el uso de las imágenes para portafolio, redes sociales y promoción del fotógrafo, salvo acuerdo contrario por escrito.
4. El fotógrafo no se responsabiliza por situaciones fuera de su control (clima, restricciones del lugar, fallas técnicas del recinto, etc.).
5. En caso de cancelación o reprogramación, el cliente deberá notificar con anticipación razonable.
6. El fotógrafo conservará los derechos de autor sobre todas las imágenes producidas.

Ambas partes aceptan los términos del presente acuerdo.
`
  },

  {
    id: "simpleRelease",
    name: "Cesión Simple de Derechos de Imagen",
    fields: [
      { key: "usagePurpose", label: "Finalidad del uso (ej: portafolio)", type: "text" },
      { key: "signatureDate", label: "Fecha de firma", type: "date" }
    ],
    content: `
CESIÓN SIMPLE DE DERECHOS DE IMAGEN

Yo, {{clientName}}, autorizo a {{photographerName}} a utilizar mi imagen en fotografías tomadas durante la sesión correspondiente, exclusivamente para los siguientes fines: {{usagePurpose}}.

Esta autorización no implica compensación económica adicional y puede ser revocada por escrito en cualquier momento.

Fecha de firma: {{signatureDate}}
`
  }
];
