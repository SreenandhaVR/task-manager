"""initial migration

Revision ID: 0001
Revises: 
Create Date: 2024-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create ENUMs first (PostgreSQL requires explicit type creation)
    taskstatus = sa.Enum('todo', 'in_progress', 'done', name='taskstatus')
    notetype   = sa.Enum('ai', 'user', name='notetype')
    taskstatus.create(op.get_bind(), checkfirst=True)
    notetype.create(op.get_bind(), checkfirst=True)

    # users table
    op.create_table(
        'users',
        sa.Column('id',            sa.Integer(),     nullable=False),
        sa.Column('email',         sa.String(),      nullable=False),
        sa.Column('password_hash', sa.String(),      nullable=False),
        sa.Column('created_at',    sa.DateTime(),    server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
    )
    op.create_index('ix_users_id',    'users', ['id'],    unique=False)
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # tasks table
    op.create_table(
        'tasks',
        sa.Column('id',          sa.Integer(),  nullable=False),
        sa.Column('title',       sa.String(),   nullable=False),
        sa.Column('description', sa.String(),   nullable=True),
        sa.Column('status',      sa.Enum('todo', 'in_progress', 'done', name='taskstatus', create_type=False), nullable=True),
        sa.Column('created_by',  sa.Integer(),  nullable=True),
        sa.Column('assigned_to', sa.Integer(),  nullable=True),
        sa.Column('created_at',  sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['assigned_to'], ['users.id']),
        sa.ForeignKeyConstraint(['created_by'],  ['users.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_tasks_id', 'tasks', ['id'], unique=False)

    # task_notes table
    op.create_table(
        'task_notes',
        sa.Column('id',         sa.Integer(),  nullable=False),
        sa.Column('task_id',    sa.Integer(),  nullable=True),
        sa.Column('note_type',  sa.Enum('ai', 'user', name='notetype', create_type=False), nullable=True),
        sa.Column('content',    sa.Text(),     nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_task_notes_id', 'task_notes', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_task_notes_id', table_name='task_notes')
    op.drop_table('task_notes')

    op.drop_index('ix_tasks_id', table_name='tasks')
    op.drop_table('tasks')

    op.drop_index('ix_users_email', table_name='users')
    op.drop_index('ix_users_id',    table_name='users')
    op.drop_table('users')

    # Drop ENUMs explicitly on downgrade
    sa.Enum(name='notetype').drop(op.get_bind(),   checkfirst=True)
    sa.Enum(name='taskstatus').drop(op.get_bind(), checkfirst=True)