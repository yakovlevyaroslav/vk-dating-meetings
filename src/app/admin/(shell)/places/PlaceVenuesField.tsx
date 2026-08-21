'use client';

import { PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export interface VenueDraft {
  id?: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  hasBonus: boolean;
  isPrimary: boolean;
  showInBonuses: boolean;
  description: string;
  promoDescription: string;
  promoCode: string;
}

interface PlaceVenuesFieldProps {
  defaultVenues: VenueDraft[];
}

function emptyVenue(isPrimary = false): VenueDraft {
  return {
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    hasBonus: false,
    isPrimary,
    showInBonuses: false,
    description: '',
    promoDescription: '',
    promoCode: '',
  };
}

export function PlaceVenuesField(props: PlaceVenuesFieldProps) {
  const { defaultVenues } = props;
  const [venues, setVenues] = useState<VenueDraft[]>(
    defaultVenues.length > 0 ? defaultVenues : [emptyVenue(true)],
  );

  function updateVenue(index: number, patch: Partial<VenueDraft>) {
    setVenues((prev) => prev.map((venue, i) => (i === index ? {
      ...venue, ...patch,
    } : venue)));
  }

  function setPrimaryVenue(index: number) {
    setVenues((prev) => prev.map((venue, i) => ({
      ...venue, isPrimary: i === index,
    })));
  }

  function addVenue() {
    setVenues((prev) => [...prev, emptyVenue()]);
  }

  function removeVenue(index: number) {
    setVenues((prev) => {
      const next = prev.filter((_, i) => i !== index);
      const removedWasPrimary = prev[index]?.isPrimary;
      if (removedWasPrimary && next.length > 0 && !next.some((venue) => venue.isPrimary)) {
        next[0] = {
          ...next[0], isPrimary: true,
        };
      }
      return next;
    });
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
            <div className="flex flex-col gap-2 sm:col-span-2">
              <Label>Описание точки</Label>
              <Textarea
                value={venue.description}
                onChange={(event) => updateVenue(index, {
                  description: event.target.value,
                })}
                placeholder="Если оставить пустым — используется описание места"
                rows={3}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Промокод точки</Label>
              <Input
                value={venue.promoCode}
                onChange={(event) => updateVenue(index, {
                  promoCode: event.target.value,
                })}
                placeholder="Если пусто — берётся промокод места"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Описание промокода точки</Label>
              <Textarea
                value={venue.promoDescription}
                onChange={(event) => updateVenue(index, {
                  promoDescription: event.target.value,
                })}
                placeholder="Можно заполнить даже без своего промокода"
                rows={2}
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
              Показывать бонус иконку, активировать промокод
            </label>

            <label className="flex w-fit items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={venue.showInBonuses}
                onChange={(event) => updateVenue(index, {
                  showInBonuses: event.target.checked,
                })}
                className="size-4"
              />
              Показывать в блоке «Бонусы»
            </label>

            <label className="flex w-fit items-center gap-2 text-sm sm:col-span-2">
              <input
                type="radio"
                name="primaryVenue"
                checked={venue.isPrimary}
                onChange={() => setPrimaryVenue(index)}
                className="size-4"
              />
              Основная точка сети (показывается в списке заведений)
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
