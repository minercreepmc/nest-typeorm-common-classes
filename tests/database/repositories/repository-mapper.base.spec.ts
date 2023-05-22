import { EntityConstructor, TypeOrmModelConstructor } from '@common-types';
import { AbstractTypeOrmMapper, AbstractTypeOrmModel } from '@repositories';
import { AbstractEntity, UUID } from 'common-base-classes';

class TestEntity extends AbstractEntity<unknown> {}
class TestOrmModel extends AbstractTypeOrmModel {}

class TestTypeOrmMapper extends AbstractTypeOrmMapper<
  TestEntity,
  unknown,
  TestOrmModel
> {
  protected toPersistanceDetails(
    entity: TestEntity,
  ): Promise<Partial<TestOrmModel>> {
    return Promise.resolve({});
  }

  protected toDomainDetails(ormModel: TestOrmModel): Promise<unknown> {
    return Promise.resolve({});
  }
}

describe('AbstractTypeOrmMapper', () => {
  let entityConstructor: EntityConstructor<TestEntity>;
  let typeOrmModelConstructor: TypeOrmModelConstructor<TestOrmModel>;
  let mapper: TestTypeOrmMapper;

  beforeEach(() => {
    entityConstructor = TestEntity as EntityConstructor<TestEntity>;
    typeOrmModelConstructor =
      TestOrmModel as TypeOrmModelConstructor<TestOrmModel>;
    mapper = new TestTypeOrmMapper(entityConstructor, typeOrmModelConstructor);
  });

  describe('toPersistance', () => {
    it('should convert an entity to an ORM model', async () => {
      const entity = new TestEntity({
        id: new UUID(),
        details: {},
      });

      const ormModel = await mapper.toPersistance(entity);

      expect(ormModel.id).toEqual(entity.id.unpack());
      expect(ormModel.createdAt).toEqual(entity.createdAt.unpack());
      expect(ormModel.updatedAt).toEqual(entity.updatedAt.unpack());
    });
  });

  describe('toDomain', () => {
    it('should convert an ORM model to an entity', async () => {
      const ormModel = new TestOrmModel();
      ormModel.id = new UUID().unpack();
      ormModel.createdAt = new Date();
      ormModel.updatedAt = new Date();

      const entity = await mapper.toDomain(ormModel);

      expect(entity.id.unpack()).toEqual(ormModel.id);
      expect(entity.createdAt.unpack()).toEqual(ormModel.createdAt);
      expect(entity.updatedAt.unpack()).toEqual(ormModel.updatedAt);
    });
  });
});
