create table users
(
    id            int auto_increment
        primary key,
    username      varchar(30)  null,
    name          varchar(30)  null,
    surname       varchar(30)  null,
    year_of_birth int          null,
    email         varchar(255) null,
    password      varchar(255) null
);

create table role
(
    id   int auto_increment
        primary key,
    name varchar(255) null
);

create table users_roles
(
    user_id int not null,
    role_id int not null,
    primary key (user_id, role_id),
        foreign key (user_id) references users (id),
        foreign key (role_id) references role (id)
);

insert into users values (1, 'admin', 'adm', 'adminov', 1991, 'adm@mail.ru',
                          '$2a$12$9Hh1iCSMrCeAZOdt3yqdQOwkG4qu03X2BXeMTvDRwdj8resMDLtSq');

insert into users values (2, 'user', 'us', 'userov', 1999, 'us@mail.ru',
                          '$2a$12$5LElFf24mf6U1pjKii8YqeWzHI1uZi6dV/z.y9y.X.DfgPT1Dfuva');

insert into role values (1, 'ADMIN');

insert into role values (2, 'USER');

insert into users_roles values (1, 1);

insert into users_roles values (2, 2)