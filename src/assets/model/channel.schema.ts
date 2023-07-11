import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('channel')
export default class Channel extends BaseEntity
{
  @PrimaryGeneratedColumn()
  public id!: number
  @Column({ nullable: true, type: 'text' })
  public name!: string
  @Column({ type: 'text' })
  public description!: string
  @Column( { type: 'text' } )
  public file!: string
  @Column({ type: 'text' })
  public image!: string
  @Column({ type: 'text' })
  public createdAt!: string
  @Column({ type: 'text' })
  public updatedAt!: string
  @Column({ type: 'text' })
  public deletedAt!: string
}