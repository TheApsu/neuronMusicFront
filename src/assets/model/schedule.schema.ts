import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity({ name: 'CompanySchedule' })

export class CompanySchedule extends BaseEntity
{ 
	@PrimaryGeneratedColumn()
  public id!: number
  @Column({ nullable: true, type: 'text' })
  public init!: string
  @Column({ nullable: true, type: 'text' })
  public end!: string
  @Column({ nullable: true, type: 'text' })
  public days!: string
  @Column({ nullable: true, type: 'text' })
  public name!: string
  @Column({ nullable: true, type: 'text' })
  public companyId!: number
  @Column({ nullable: true, type: 'text' })
  public createdAt!: string
  @Column({ nullable: true, type: 'text' })
  public updatedAt!: string
  @Column({ nullable: true, type: 'text' })
  public deletedAt!: string
}
