import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractTypeOrmModel {
  constructor(props?: AbstractTypeOrmModel) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  @PrimaryColumn({ update: false })
  id: string;

  @CreateDateColumn({
    type: 'timestamptz',
    update: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;
}
