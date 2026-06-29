"use client";

import { useState } from "react";
import jsPDF from "jspdf";

type Item = {
  desc: string;
  qty: number;
  price: number;
};

export default function Home() {
  const [lang, setLang] = useState<"fr" | "ar">("fr");
  const [client, setClient] = useState<string>("");
  const [items, setItems] = useState<Item[]>([
    { desc: "", qty: 1, price: 0 }
  ]);

  const t = {
    fr: {
      title: "Générateur de factures",
      client: "Client",
      add: "Ajouter article",
      download: "Télécharger PDF",
      total: "Total",
      whatsapp: "Envoyer via WhatsApp"
    },
    ar: {
      title: "مولد الفواتير",
      client: "العميل",
      add: "إضافة عنصر",
      download: "تحميل PDF",
      total: "المجموع",
      whatsapp: "إرسال عبر واتساب"
    }
  };

  const updateItem = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    const copy = [...items];
    (copy[index] as any)[field] = value;
    setItems(copy);
  };

  const addItem = () => {
    setItems([...items, { desc: "", qty: 1, price: 0 }]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text(t[lang].title, 10, 10);
    doc.text(`${t[lang].client}: ${client}`, 10, 20);

    let y = 30;

    items.forEach((item) => {
      doc.text(
        `${item.desc} | ${item.qty} x ${item.price} = ${
          item.qty * item.price
        }`,
        10,
        y
      );
      y += 10;
    });

    doc.text(`${t[lang].total}: ${total} TND`, 10, y + 10);

    doc.save("invoice.pdf");
  };

  const sendWhatsApp = () => {
    const text =
      `Invoice for ${client}\n` +
      items
        .map(
          (it) =>
            `${it.desc} ${it.qty}x${it.price} = ${
              it.qty * it.price
            }`
        )
        .join("\n") +
      `\nTotal: ${total} TND`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>{t[lang].title}</h1>

      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setLang("fr")}>FR</button>
        <button onClick={() => setLang("ar")}>AR</button>
      </div>

      <div>
        <label>{t[lang].client}</label>
        <input
          value={client}
          onChange={(e) => setClient(e.target.value)}
          style={{ marginLeft: 10 }}
        />
      </div>

      <h3>Items</h3>

      {items.map((item, index) => (
        <div key={index}>
          <input
            placeholder="description"
            value={item.desc}
            onChange={(e) =>
              updateItem(index, "desc", e.target.value)
            }
          />
          <input
            type="number"
            value={item.qty}
            onChange={(e) =>
              updateItem(index, "qty", Number(e.target.value))
            }
          />
          <input
            type="number"
            value={item.price}
            onChange={(e) =>
              updateItem(index, "price", Number(e.target.value))
            }
          />
        </div>
      ))}

      <button onClick={addItem}>{t[lang].add}</button>

      <h2>
        {t[lang].total}: {total} TND
      </h2>

      <button onClick={generatePDF}>
        {t[lang].download}
      </button>

      <button onClick={sendWhatsApp}>
        {t[lang].whatsapp}
      </button>
    </div>
  );
}