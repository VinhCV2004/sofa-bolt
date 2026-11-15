import type { ICalendarEvent } from 'src/types/calendar';

import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/mock-api';

// ----------------------------------------------------------------------

const CALENDAR_ENDPOINT = endpoints.calendar;

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type EventsData = {
  events: ICalendarEvent[];
};

export function useGetEvents() {
  const { data, isLoading, error, isValidating } = useSWR<EventsData>(
    CALENDAR_ENDPOINT,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(() => {
    const events = data?.events.map((event) => ({
      ...event,
      textColor: event.color,
    }));

    return {
      events: events || [],
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
      eventsEmpty: !isLoading && !data?.events.length,
    };
  }, [data?.events, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData: ICalendarEvent) {
  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents: ICalendarEvent[] = currentData?.events;

      const events = [...currentEvents, eventData];

      return { ...currentData, events };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function updateEvent(eventData: Partial<ICalendarEvent>) {
  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents: ICalendarEvent[] = currentData?.events;

      const events = currentEvents.map((event) =>
        event.id === eventData.id ? { ...event, ...eventData } : event
      );

      return { ...currentData, events };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId: string) {
  /**
   * Work in local
   */
  mutate(
    CALENDAR_ENDPOINT,
    (currentData) => {
      const currentEvents: ICalendarEvent[] = currentData?.events;

      const events = currentEvents.filter((event) => event.id !== eventId);

      return { ...currentData, events };
    },
    false
  );
}
