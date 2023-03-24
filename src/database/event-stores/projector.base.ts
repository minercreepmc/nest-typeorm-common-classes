import { WhereClause } from '@common-types';
import {
  IBaseEntity,
  ID,
  ILogger,
  ProjectionRepositoryPort,
  QueryParams,
} from 'common-base-classes';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AbstractTypeOrmModel } from '../repositories';

export class AbstractProjectionRepository<
  ReadModel extends AbstractTypeOrmModel,
> implements ProjectionRepositoryPort<ReadModel>
{
  constructor(
    protected readonly repository: Repository<ReadModel>,
    protected readonly logger: ILogger,
  ) {}

  async save(model: ReadModel): Promise<ReadModel> {
    const created = await this.repository.save(model);
    this.logger.debug(`[Projection]: created ${created.id}`);
    return created;
  }

  async delete(model: ReadModel): Promise<boolean> {
    const deleted = await this.repository.remove(model);
    this.logger.debug(`[Projection]: deleted ${deleted.id}`);
    return Boolean(deleted);
  }

  async findOneById(id: string | ID): Promise<ReadModel | undefined> {
    const found = await this.repository
      .createQueryBuilder('collections')
      .where('collections.id = :id', {
        id: id instanceof ID ? id.unpack() : id,
      })
      .getOne();

    return found ? found : undefined;
  }

  async findOne(params: QueryParams<ReadModel> = {}): Promise<ReadModel> {
    const found = await this.repository.findOne({
      where: params as FindOptionsWhere<ReadModel>,
    });

    return found ? found : undefined;
  }

  async update(id: string, newState: ReadModel): Promise<ReadModel> {
    const updated = await this.repository.save({ id, ...newState });
    this.logger.debug(`[Projection]: updated ${updated.id}`);
    return updated;
  }
}
