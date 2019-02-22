import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column('varchar', { length: 255 })
  email: string

  @Column('text')
  password: string

  @Column('boolean', { default: false })
  confirmed: boolean
}
