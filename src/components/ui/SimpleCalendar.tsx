"use client";

import React from "react";

export default function SimpleCalendar({ items, onClickItem }: { items: { id: string; date: string; title?: string }[]; onClickItem?: (id: string) => void }) {
  return (
    <div className="border rounded p-3">
      <div className="text-sm text-muted-foreground mb-2">Upcoming</div>
      <ul className="space-y-2">
        {items.map(it => (
          <li key={it.id} className="flex justify-between items-center">
            <div>
              <div className="font-medium">{it.title ?? it.id}</div>
              <div className="text-xs text-muted-foreground">{it.date}</div>
            </div>
            <div>
              <button className="text-sm text-primary underline" onClick={() => onClickItem && onClickItem(it.id)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
