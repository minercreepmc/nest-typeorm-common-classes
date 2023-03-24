import { QueryParams, WhereClause } from '@common-types';
import { AbstractQueryMapper } from '@repositories';

interface TestEntityDetails {
  name?: string;
}

class TestOrmModel {
  name?: string;
}

class TestQueryMapper extends AbstractQueryMapper<
  TestEntityDetails,
  TestOrmModel
> {
  toQuery(params: QueryParams<TestEntityDetails>): WhereClause<TestOrmModel> {
    const query: WhereClause<TestOrmModel> = {};

    if (params.name) {
      query.name = params.name;
    }

    return query;
  }
}

describe('AbstractQueryMapper', () => {
  let mapper: TestQueryMapper;

  beforeEach(() => {
    mapper = new TestQueryMapper();
  });

  describe('toQuery', () => {
    it('should convert query params to a where clause', () => {
      const params: QueryParams<TestEntityDetails> = {
        name: 'John Doe',
      };

      const whereClause: WhereClause<TestOrmModel> = mapper.toQuery(params);

      expect(whereClause).toEqual({ name: 'John Doe' });
    });

    it('should return an empty where clause if query params are empty', () => {
      const params: QueryParams<TestEntityDetails> = {};

      const whereClause: WhereClause<TestOrmModel> = mapper.toQuery(params);

      expect(whereClause).toEqual({});
    });
  });
});
