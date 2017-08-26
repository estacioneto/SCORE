###############################################################################################
# Script que configura o backup automático para o BD                                          #
#                                                                                             #
# Precisa que as variáveis de ambiente USER_BD e PASS_BD estejam definidas,                   #
# como o usuário e senha para conexão com banco, respectivamente.                             #
#                                                                                             #
# Para configurar o backup, você deve:                                                        #
# 1- Executar sudo crontab -e                                                                 #
# 2- Adicionar esta linha ao final do arquivo:                                                #
#      00 02 * * * {base_projeto}/bd_backup.sh                                                #
#                                                                                             #
# O backup ocorrerá todos os dias as 02:00                                                    #
#                                                                                             #
# Para criar o usuário do mongo:                                                              #
#  1. Acesse o bd, execute "use admin"                                                        #
#  2. db.createUser({ user: "{USUARIO}", pwd: "{SENHA}",                                      #
#        roles: [{ role: "root", db: "admin" }]})                                             #
# https://stackoverflow.com/questions/38921414/mongodb-what-are-the-default-user-and-password #                                                                         #
#                                                                                             #
###############################################################################################

if [[ -z $USER_BD ]]; then
    echo ">> Usuário não definido para a conexão com o BD."
    exit 1
fi
if [[ -z $PASS_BD ]]; then
    echo ">> Senha não definida para a conexão com o BD."
    exit 1
fi

DIR_BACKUP="./mongo_backup"
DIR_TEMP=$DIR_BACKUP"_temp"

mkdir $DIR_TEMP

echo ">> Iniciando dump"
mongodump -h 127.0.0.1:27017 -d SCORE -u $USER_BD -p $PASS_BD -o $DIR_TEMP --authenticationDatabase admin

echo ">> Dump finalizado."

rm -rf $DIR_BACKUP
mv $DIR_TEMP $DIR_BACKUP
rm -rf $DIR_TEMP
