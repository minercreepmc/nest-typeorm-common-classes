import {
  EventConstructor,
  EventConstructorDocuments,
  TypeOrmModelConstructor,
} from '@common-types';
import {
  DateVO,
  DomainEvent,
  PersistentMapper,
  UUID,
} from 'common-base-classes';
import { EventTypeOrmModel } from './event-store-model.base';

export abstract class AbstractEventTypeOrmMapper<
  Event extends DomainEvent<any>,
  EventDetails,
  EventOrmModel extends EventTypeOrmModel<EventOrmModelDetails>,
  EventOrmModelDetails,
> implements PersistentMapper<Event, EventOrmModel>
{
  constructor(
    //private readonly eventConstructor: EventConstructor<Event>,
    private readonly typeOrmModelConstructor: TypeOrmModelConstructor<EventOrmModel>,
  ) {}

  protected abstract toDomainDetails(
    details: EventOrmModelDetails,
  ): EventDetails;
  protected abstract toPersistanceDetails(event: EventDetails): object;
  protected abstract toPersistentIndexColumns(event: Event): object;
  protected abstract eventConstructorDocuments: EventConstructorDocuments<
    string,
    EventConstructor<Event>
  >;

  toPersistent(event: Event): EventOrmModel {
    const details = this.toPersistanceDetails(event.details);
    const childColumn = this.toPersistentIndexColumns(event);
    return new this.typeOrmModelConstructor({
      eventId: event.eventId.unpack(),
      entityId: event.entityId.unpack(),
      dateOccurred: event.dateOccurred.unpack(),
      eventName: event.eventName,
      entityType: event.entityType,
      eventData: details,
      ...childColumn,
    });
  }

  toDomain(persistentObject: EventOrmModel): Event {
    const eventId = new UUID(persistentObject.eventId);
    const entityId = new UUID(persistentObject.entityId);
    const dateOccurred = DateVO.create(persistentObject.dateOccurred);
    const eventDetails = this.toDomainDetails(persistentObject.eventData);
    const eventName = persistentObject.eventName;
    const entityType = persistentObject.entityType;
    const eventConstructor = this.eventConstructorDocuments[eventName];
    return new eventConstructor({
      eventDetails,
      eventId,
      eventName,
      entityId,
      entityType,
      dateOccurred,
    });
  }
}
