PGDMP  1                     |            PRUEBA    16.2    16.2 "               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            	           1262    38086    PRUEBA    DATABASE     {   CREATE DATABASE "PRUEBA" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';
    DROP DATABASE "PRUEBA";
                postgres    false            �            1259    38123    clientes    TABLE     	  CREATE TABLE public.clientes (
    id integer NOT NULL,
    nit numeric NOT NULL,
    razon_social character varying NOT NULL,
    correo character varying NOT NULL,
    telefono numeric NOT NULL,
    estado boolean NOT NULL,
    id_user_create integer NOT NULL
);
    DROP TABLE public.clientes;
       public         heap    postgres    false            �            1259    38122    clientes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.clientes_id_seq;
       public          postgres    false    222            
           0    0    clientes_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;
          public          postgres    false    221            �            1259    38106    rol_user    TABLE     u   CREATE TABLE public.rol_user (
    id integer NOT NULL,
    id_user integer NOT NULL,
    id_rol integer NOT NULL
);
    DROP TABLE public.rol_user;
       public         heap    postgres    false            �            1259    38105    rol_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.rol_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.rol_user_id_seq;
       public          postgres    false    220                       0    0    rol_user_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.rol_user_id_seq OWNED BY public.rol_user.id;
          public          postgres    false    219            �            1259    38097    roles    TABLE     c   CREATE TABLE public.roles (
    id integer NOT NULL,
    description character varying NOT NULL
);
    DROP TABLE public.roles;
       public         heap    postgres    false            �            1259    38096    roles_id_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.roles_id_seq;
       public          postgres    false    218                       0    0    roles_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;
          public          postgres    false    217            �            1259    38088    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    38087    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    215            b           2604    38126    clientes id    DEFAULT     j   ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);
 :   ALTER TABLE public.clientes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            a           2604    38109    rol_user id    DEFAULT     j   ALTER TABLE ONLY public.rol_user ALTER COLUMN id SET DEFAULT nextval('public.rol_user_id_seq'::regclass);
 :   ALTER TABLE public.rol_user ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            `           2604    38100    roles id    DEFAULT     d   ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);
 7   ALTER TABLE public.roles ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            _           2604    38091    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216                      0    38123    clientes 
   TABLE DATA           c   COPY public.clientes (id, nit, razon_social, correo, telefono, estado, id_user_create) FROM stdin;
    public          postgres    false    222   �"                 0    38106    rol_user 
   TABLE DATA           7   COPY public.rol_user (id, id_user, id_rol) FROM stdin;
    public          postgres    false    220   #       �          0    38097    roles 
   TABLE DATA           0   COPY public.roles (id, description) FROM stdin;
    public          postgres    false    218   ?#       �          0    38088    users 
   TABLE DATA           7   COPY public.users (id, username, password) FROM stdin;
    public          postgres    false    216   s#                  0    0    clientes_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.clientes_id_seq', 1, false);
          public          postgres    false    221                       0    0    rol_user_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.rol_user_id_seq', 3, true);
          public          postgres    false    219                       0    0    roles_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.roles_id_seq', 1, false);
          public          postgres    false    217                       0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
          public          postgres    false    215            j           2606    38130    clientes clientes_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.clientes DROP CONSTRAINT clientes_pkey;
       public            postgres    false    222            h           2606    38111    rol_user rol_user_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.rol_user
    ADD CONSTRAINT rol_user_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.rol_user DROP CONSTRAINT rol_user_pkey;
       public            postgres    false    220            f           2606    38104    roles roles_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public            postgres    false    218            d           2606    38095    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            k           2606    38112    rol_user FK_ROL    FK CONSTRAINT     o   ALTER TABLE ONLY public.rol_user
    ADD CONSTRAINT "FK_ROL" FOREIGN KEY (id_rol) REFERENCES public.roles(id);
 ;   ALTER TABLE ONLY public.rol_user DROP CONSTRAINT "FK_ROL";
       public          postgres    false    220    4710    218            l           2606    38117    rol_user FK_USER    FK CONSTRAINT     q   ALTER TABLE ONLY public.rol_user
    ADD CONSTRAINT "FK_USER" FOREIGN KEY (id_user) REFERENCES public.users(id);
 <   ALTER TABLE ONLY public.rol_user DROP CONSTRAINT "FK_USER";
       public          postgres    false    220    4708    216                  x������ � �            x�3�4�4�2��\1z\\\ 1      �   $   x�3�t,N-�/�2�tL����,.)JL�c���� ���      �      x�3�LL��̃�\1z\\\ 8Z     