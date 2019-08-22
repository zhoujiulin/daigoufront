export enum EnumStatusCommande {
    ERREUR_IN_COMMANDE = 0,
    NEW_COMMANDE = 1,
    COMMANDE_PARTIE_PRET = 2,
    COMMANDE_PARTIE_PRET_A_ENVOYER = 3,
    COMMANDE_PRET_A_ENVOYER = 4,
    COMMANDE_SUR_LA_ROUTE = 5,
    COMMANDE_MANQUE_INFO_CLIENT = 6,
    COMMANDE_PRET_A_DISTRIBUER = 7,
    TERMINE = 8
}