'use client';

import { ArrowDownIcon, ArrowUpIcon, PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { quickCreatePlace } from './actions';

const STOP_DESCRIPTION_MAX_LENGTH = 120;

interface VenueOption {
  id: string;
  name: string;
}

interface PlaceOption {
  id: string;
  name: string;
  venues: VenueOption[];
}

export interface StopDraft {
  placeVenueId: string;
  placeName: string;
  venueName: string;
  description: string;
}

interface RouteStopsFieldProps {
  places: PlaceOption[];
  cities: { id: string; name: string }[];
  defaultStops: StopDraft[];
}

const EMPTY_QUICK_FORM = {
  cityId: '', name: '', address: '', latitude: '', longitude: '',
};

export function RouteStopsField(props: RouteStopsFieldProps) {
  const { cities } = props;
  const [places, setPlaces] = useState(props.places);
  const [stops, setStops] = useState<StopDraft[]>(props.defaultStops);
  const [selectedPlaceId, setSelectedPlaceId] = useState('');
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [quickForm, setQuickForm] = useState(EMPTY_QUICK_FORM);
  const [isCreating, setIsCreating] = useState(false);

  const selectedPlace = places.find((place) => place.id === selectedPlaceId);

  function addExistingStop() {
    if (!selectedPlace || !selectedVenueId) {
      return;
    }
    const venue = selectedPlace.venues.find((item) => item.id === selectedVenueId);
    if (!venue) {
      return;
    }
    setStops((prev) => [...prev, {
      placeVenueId: venue.id, placeName: selectedPlace.name, venueName: venue.name, description: '',
    }]);
    setSelectedPlaceId('');
    setSelectedVenueId('');
  }

  function updateStop(index: number, patch: Partial<StopDraft>) {
    setStops((prev) => prev.map((stop, i) => (i === index ? {
      ...stop, ...patch,
    } : stop)));
  }

  function removeStop(index: number) {
    setStops((prev) => prev.filter((_, i) => i !== index));
  }

  function moveStop(index: number, direction: -1 | 1) {
    setStops((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) {
        return prev;
      }
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  }

  async function handleQuickCreate() {
    setIsCreating(true);
    try {
      const result = await quickCreatePlace(quickForm);
      setPlaces((prev) => [...prev, {
        id: result.placeId, name: result.placeName, venues: [result.venue],
      }]);
      setStops((prev) => [
        ...prev,
        {
          placeVenueId: result.venue.id, placeName: result.placeName, venueName: result.venue.name, description: '',
        },
      ]);
      setQuickForm(EMPTY_QUICK_FORM);
      setShowQuickCreate(false);
      toast.success('Место создано и добавлено в маршрут');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось создать место');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="hidden"
        name="stops"
        value={JSON.stringify(stops.map((stop) => ({
          placeVenueId: stop.placeVenueId, description: stop.description,
        })))}
      />

      {stops.length === 0 ? <p className="text-sm text-muted-foreground">Остановок пока нет</p> : null}
      {stops.map((stop, index) => (

        <div key={index} className="flex flex-col gap-2 rounded-md border p-2">
          <div className="flex items-center gap-2">
            <span className="flex-1 text-sm">
              {index + 1}. {stop.placeName} — {stop.venueName}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => moveStop(index, -1)}
              disabled={index === 0}
            >
              <ArrowUpIcon />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => moveStop(index, 1)}
              disabled={index === stops.length - 1}
            >
              <ArrowDownIcon />
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeStop(index)}>
              <XIcon />
            </Button>
          </div>
          <Textarea
            value={stop.description}
            onChange={(event) => updateStop(index, {
              description: event.target.value,
            })}
            placeholder="Описание места в этом маршруте — если пусто, используется обычное описание места"
            maxLength={STOP_DESCRIPTION_MAX_LENGTH}
            rows={2}
          />
        </div>
      ))}

      <div className="flex flex-wrap items-end gap-2 rounded-md border p-3">
        <div className="flex flex-col gap-1">
          <Label>Место</Label>
          <select
            value={selectedPlaceId}
            onChange={(event) => {
              setSelectedPlaceId(event.target.value);
              setSelectedVenueId('');
            }}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            <option value="">Выберите место</option>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <Label>Точка</Label>
          <select
            value={selectedVenueId}
            onChange={(event) => setSelectedVenueId(event.target.value)}
            disabled={!selectedPlace}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            <option value="">Выберите точку</option>
            {selectedPlace?.venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>
        <Button type="button" onClick={addExistingStop} disabled={!selectedVenueId}>
          Добавить остановку
        </Button>
      </div>

      {showQuickCreate ? (
        <div className="flex flex-col gap-3 rounded-md border p-3">
          <div className="flex flex-col gap-1">
            <Label>Город</Label>
            <select
              value={quickForm.cityId}
              onChange={(event) => setQuickForm((prev) => ({
                ...prev, cityId: event.target.value,
              }))}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="">Выберите город</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label>Название</Label>
              <Input
                value={quickForm.name}
                onChange={(event) => setQuickForm((prev) => ({
                  ...prev, name: event.target.value,
                }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Адрес</Label>
              <Input
                value={quickForm.address}
                onChange={(event) => setQuickForm((prev) => ({
                  ...prev, address: event.target.value,
                }))}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Широта</Label>
              <Input
                value={quickForm.latitude}
                onChange={(event) => setQuickForm((prev) => ({
                  ...prev, latitude: event.target.value,
                }))}
                inputMode="decimal"
                placeholder="55.751244"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Долгота</Label>
              <Input
                value={quickForm.longitude}
                onChange={(event) => setQuickForm((prev) => ({
                  ...prev, longitude: event.target.value,
                }))}
                inputMode="decimal"
                placeholder="37.618423"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={handleQuickCreate} disabled={isCreating}>
              {isCreating ? 'Создаём…' : 'Создать и добавить'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowQuickCreate(false);
                setQuickForm(EMPTY_QUICK_FORM);
              }}
            >
              Отмена
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" className="w-fit" onClick={() => setShowQuickCreate(true)}>
          <PlusIcon />
          Новое место для маршрута
        </Button>
      )}
    </div>
  );
}
