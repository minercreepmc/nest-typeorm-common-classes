import {
  EntityConstructor,
  OrmModelDetails,
  TypeOrmModelConstructor,
} from '@common-types';
import { AbstractEntity, DateVO, ID, UUID } from 'common-base-classes';
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
  ): Promise<OrmModelDetails<OrmModel>>;
  protected abstract toDomainDetails(
    ormModel: OrmModel,
  ): Promise<EntityDetails>;

  async toPersistance(entity: Entity): Promise<OrmModel> {
    const details = await this.toPersistanceDetails(entity);

    return new this.typeOrmModelConstructor({
      ...details,
      id: entity.id.unpack(),
      createdAt: entity.createdAt.unpack(),
      updatedAt: entity.updatedAt.unpack(),
    });
  }

  async toDomain(ormModel: OrmModel): Promise<Entity> {
    const details = await this.toDomainDetails(ormModel);
    const id = new ID(ormModel.id);
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
