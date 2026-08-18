'use client';

import { PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface VenueDraft {
  id?: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  hasBonus: boolean;
}

interface PlaceVenuesFieldProps {
  defaultVenues: VenueDraft[];
}

function emptyVenue(): VenueDraft {
  return {
    name: '', address: '', latitude: '', longitude: '', hasBonus: false,
  };
}

export function PlaceVenuesField(props: PlaceVenuesFieldProps) {
  const { defaultVenues } = props;
  const [venues, setVenues] = useState<VenueDraft[]>(defaultVenues.length > 0 ? defaultVenues : [emptyVenue()]);

  function updateVenue(index: number, patch: Partial<VenueDraft>) {
    setVenues((prev) => prev.map((venue, i) => (i === index ? {
      ...venue, ...patch,
    } : venue)));
  }

  function addVenue() {
    setVenues((prev) => [...prev, emptyVenue()]);
  }

  function removeVenue(index: number) {
    setVenues((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="venues" value={JSON.stringify(venues)} />
      {venues.map((venue, index) => (

        <Card key={index}>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Название точки</Label>
              <Input
                value={venue.name}
                onChange={(event) => updateVenue(index, {
                  name: event.target.value,
                })}
                placeholder="Напр. «Карлсон на Тверской»"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Адрес</Label>
              <Input value={venue.address} onChange={(event) => updateVenue(index, {
                address: event.target.value,
              })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Широта</Label>
              <Input
                value={venue.latitude}
                onChange={(event) => updateVenue(index, {
                  latitude: event.target.value,
                })}
                inputMode="decimal"
                placeholder="55.751244"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Долгота</Label>
              <Input
                value={venue.longitude}
                onChange={(event) => updateVenue(index, {
                  longitude: event.target.value,
                })}
                inputMode="decimal"
                placeholder="37.618423"
              />
            </div>
            <label className="flex w-fit items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={venue.hasBonus}
                onChange={(event) => updateVenue(index, {
                  hasBonus: event.target.checked,
                })}
                className="size-4"
              />
              Есть бонус (значок на карте)
            </label>

            <div className="flex justify-end sm:col-span-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeVenue(index)}
                disabled={venues.length === 1}
              >
                <XIcon />
                Убрать точку
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" onClick={addVenue} className="w-fit">
        <PlusIcon />
        Добавить точку
      </Button>
    </div>
  );
}
