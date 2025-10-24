"use client";

import React from "react";

type Item = { id: string; date?: string; title?: string };

type Props = {
  items: Item[];
  onClickItem?: (id: string) => void;
};

export default function SimpleCalendar({ items, onClickItem }: Props) {
  return (
    <div className="space-y-2">
      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">No items</div>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li key={it.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{it.title}</div>
                <div className="text-xs text-muted-foreground">{it.date}</div>
              </div>
              <div>
                <button type="button" onClick={() => onClickItem?.(it.id)} className="text-sm text-primary">Open</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

