import {
  EntityConstructor,
  OrmModelDetails,
  TypeOrmModelConstructor,
} from '@common-types';
import { AbstractEntity, DateVO, UUID } from 'common-base-classes';
import { AbstractTypeOrmModel } from './repository-model.base';
export abstract class AbstractTypeOrmMapper<
  Entity extends AbstractEntity<unknown>,
  EntityDetails,
  OrmModel extends AbstractTypeOrmModel,
> {
  constructor(
    private readonly entityConstructor: EntityConstructor<Entity>,
    private readonly typeOrmModelConstructor: TypeOrmModelConstructor<OrmModel>,
  ) {}

  protected abstract toPersistanceDetails(
    entity: Entity,
  ): OrmModelDetails<OrmModel>;
  protected abstract toDomainDetails(ormModel: OrmModel): EntityDetails;

  toPersistance(entity: Entity): OrmModel {
    const details = this.toPersistanceDetails(entity);

    return new this.typeOrmModelConstructor({
      ...details,
      id: entity.id.unpack(),
      createdAt: entity.createdAt.unpack(),
      updatedAt: entity.updatedAt.unpack(),
    });
  }

  toDomain(ormModel: OrmModel): Entity {
    const details = this.toDomainDetails(ormModel);
    const id = new UUID(ormModel.id);
    const createdAt = DateVO.create(ormModel.createdAt);
    const updatedAt = DateVO.create(ormModel.updatedAt);

    return new this.entityConstructor({
      id,
      details,
      createdAt,
      updatedAt,
    });
  }
}
