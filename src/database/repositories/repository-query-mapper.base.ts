import { QueryParams, WhereClause } from '@common-types';

export abstract class AbstractQueryMapper<EntityDetails, OrmModel> {
  abstract toQuery(params: QueryParams<EntityDetails>): WhereClause<OrmModel>;
}
