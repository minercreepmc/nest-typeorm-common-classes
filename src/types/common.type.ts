import { IBaseEntity } from 'common-base-classes';
import { FindOptionsWhere } from 'typeorm';

export type EventConstructor<Event> = new (...details: any) => Event;
export type EntityConstructor<Entity> = new (...details: any) => Entity;
export type TypeOrmModelConstructor<OrmModel> = new (details: any) => OrmModel;

export type EventConstructorDocuments<
  DomainEventName extends string,
  DomainEventClass,
> = Record<DomainEventName, DomainEventClass>;

export type QueryParams<EntityDetails> = Partial<IBaseEntity & EntityDetails>;

export type WhereClause<OrmModel> =
  | FindOptionsWhere<OrmModel>
  | FindOptionsWhere<OrmModel>[];

export type OrmModelDetails<OrmModel> = Omit<
  OrmModel,
  'id' | 'createdAt' | 'updatedAt'
>;
