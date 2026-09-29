/**
 * Sem-Banha Smokehouse & Brasa Brasileira
 * Data source for Menu, Comanda, Loyalty Stamps and Social Mural
 */

const RESTAURANT_DATA = {
    info: {
        name: "Sem-Banha Smokehouse & Brasa Brasileira",
        tagline: "Tradição do Fogo & Brasa",
        table: 14,
        tableLabel: "MESA 14 · SALÃO PRINCIPAL",
        status: "Ativa",
        openedAt: "19:42",
        waiter: "Lucas Silva",
        orderId: "#4920",
        season: "TEMPORADA 2025/2026",
        rank: "Nível Mestre Churrasqueiro"
    },

    categories: [
        { id: "todos", label: "Todos os Itens", icon: "🔥" },
        { id: "favoritos", label: "Favoritos da Brasa", icon: "⭐" },
        { id: "cortes", label: "Cortes Nobres", icon: "🥩" },
        { id: "petiscos", label: "Porções & Petiscos", icon: "🥓" },
        { id: "pratos", label: "Pratos Tradicionais", icon: "🥘" },
        { id: "bebidas", label: "Chopp & Bebidas", icon: "🍺" },
        { id: "sobremesas", label: "Sobremesas na Brasa", icon: "🍮" }
    ],

    dishes: [
        {
            id: "costela-bbq",
            name: "Costela BBQ Defumada 12h",
            category: "favoritos",
            price: 109.90,
            image: "assets/images/costela-bbq.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
            badges: ["DEFUMADO A LENHA", "RECEITA DE ASSINATURA"],
            serving: "Serve 2 pessoas",
            weight: "700g · Cozimento Lento",
            description: "Costela suína selecionada, marinada em especiarias artesanais e defumada lentamente em lenha de macieira por 12 horas. Glaceada com molho barbecue de casa levemente picante.",
            acompanhamentos: [
                { id: "arroz-carreteiro", name: "Arroz Carreteiro", desc: "Tradicional no disco de arado com carne seca", included: true },
                { id: "mandioca-manteiga", name: "Mandioca na Manteiga de Garrafa", desc: "Cozida, ultra macia e finalizada no calor da brasa", included: true },
                { id: "farofa-castanha", name: "Farofa Crocante de Castanha", desc: "Farinha de mandioca artesanal, cebola dourada e castanhas", included: true },
                { id: "vinagrete-roca", name: "Vinagrete de Roça", desc: "Tomates frescos, cebola roxa marinada e azeite extravirgem", included: true }
            ],
            molhos: [
                { id: "chimichurri", name: "Chimichurri Brasileiro com Ervas Frescas", price: 0.00 },
                { id: "molho-lambao", name: "Molho Lambão com Pimenta Biquinho", price: 4.50 },
                { id: "geleia-pimenta", name: "Geleia de Pimenta Defumada da Casa", price: 4.50 }
            ]
        },
        {
            id: "feijoada-completa",
            name: "Feijoada Completa da Casa",
            category: "pratos",
            price: 89.90,
            image: "assets/images/feijoada.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80",
            badges: ["CLÁSSICO BRASILEIRO", "ESPECIAL NO FOGO"],
            serving: "Serve 2 a 3 pessoas",
            weight: "Em panela de barro artesanal",
            description: "Tradicional feijoada em panela de barro com carnes nobres defumadas na casa, arroz branco soltinho, couve manteiga refogada no alho, farofa crocante e torresmo pururuca estalando.",
            acompanhamentos: [
                { id: "arroz-branco", name: "Arroz Branco Soltinho", desc: "Clássico brasileiro cozido ao dente", included: true },
                { id: "farofa-bacon", name: "Farofa de Bacon e Alho", desc: "Dourada e crocante", included: true },
                { id: "couve-refogada", name: "Couve na Manteiga", desc: "Fatiada fininha com alho tostado", included: true }
            ],
            molhos: [
                { id: "molho-pimenta-feijao", name: "Molho de Pimenta da Feijoada", price: 0.00 },
                { id: "laranja-fatiada", name: "Porção Extra de Laranja Bahia", price: 3.50 }
            ]
        },
        {
            id: "baiao-de-dois",
            name: "Baião de Dois do Sertão",
            category: "pratos",
            price: 74.90,
            image: "assets/images/baiao.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
            badges: ["TRADIÇÃO NORDESTINA", "RECEITA RAIZ"],
            serving: "Serve 2 pessoas",
            weight: "Receita Autêntica",
            description: "Feijão-de-corda refogado com arroz da terra, carne seca desfiada suculenta, queijo coalho tostado na brasa, manteiga de garrafa e cheiro-verde fresco da horta.",
            acompanhamentos: [
                { id: "mandioca-frita", name: "Mandioca Cremosa Frita", desc: "Crocante por fora, nuvem por dentro", included: true },
                { id: "farofa-manteiga", name: "Farofinha de Manteiga", desc: "Tostada na panela de ferro", included: true }
            ],
            molhos: [
                { id: "manteiga-garrafa-extra", name: "Dose Extra de Manteiga de Garrafa", price: 3.00 },
                { id: "pimenta-biquinho", name: "Conservinha de Pimenta Biquinho", price: 3.50 }
            ]
        },
        {
            id: "escondidinho-carne-seca",
            name: "Escondidinho de Carne Seca Gratinado",
            category: "pratos",
            price: 68.00,
            image: "assets/images/escondidinho.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80",
            badges: ["FORNO A LENHA", "GRATINADO NA BRASA"],
            serving: "Individual generoso",
            weight: "Cumbuca de Barro",
            description: "Cremoso purê de mandioca com recheio farto de carne seca desfiada temperada com especiarias, gratinado com queijo parmesão da Canastra e catupiry borbulhante.",
            acompanhamentos: [
                { id: "arroz-alho", name: "Arroz Branco com Alho Frito", desc: "Acompanhamento tradicional", included: true }
            ],
            molhos: [
                { id: "chimichurri-verde", name: "Chimichurri Fresco", price: 0.00 }
            ]
        },
        {
            id: "strogonoff-carne",
            name: "Strogonoff de Carne Tradicional",
            category: "pratos",
            price: 64.50,
            image: "assets/images/strogonoff.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80",
            badges: ["PREFERIDO DA FAMÍLIA", "FILÉ MIGNON"],
            serving: "Serve 1 a 2 pessoas",
            weight: "Cortes de Filé Mignon",
            description: "Tiras de filé mignon grelhadas no fogo alto, molho cremoso com cogumelos Paris frescos, acompanhado de arroz branco soltinho e batata palha artesanal ultra crocante.",
            acompanhamentos: [
                { id: "arroz-branco", name: "Arroz Branco", desc: "Soltinho e quentinho", included: true },
                { id: "batata-palha", name: "Batata Palha Artesanal da Casa", desc: "Super fina e crocante", included: true }
            ],
            molhos: []
        },
        {
            id: "torresmo-de-rolo",
            name: "Torresmo de Rolo Pururuca",
            category: "petiscos",
            price: 58.90,
            image: "assets/images/mural_costela.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&auto=format&fit=crop&q=80",
            badges: ["CROCANTE", "PETISCO DA CASA"],
            serving: "Porção para compartilhar",
            weight: "450g",
            description: "Corte artesanal da barriga suína enrolada, assada lentamente por 6 horas e pururucada em alta temperatura. Acompanha geleia de pimenta defumada.",
            acompanhamentos: [
                { id: "limao-caipira", name: "Gomos de Limão Rosa", desc: "Frescos para espremer na hora", included: true }
            ],
            molhos: [
                { id: "geleia-pimenta", name: "Geleia de Pimenta Defumada", price: 0.00 }
            ]
        },
        {
            id: "chopp-puro-malte",
            name: "Chopp Puro Malte Artesanal 500ml",
            category: "bebidas",
            price: 18.50,
            image: "assets/images/mural_chopp.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1608270172608-518258457007?w=600&auto=format&fit=crop&q=80",
            badges: ["CANECA CONGELADA -2°C", "PURO MALTE"],
            serving: "500ml",
            weight: "Cerveja Pilsen Especial",
            description: "Servido em caneca ultracongelada a -2°C. Colarinho denso, cremoso e persistente com amargor suave e notas de malte fresco.",
            acompanhamentos: [],
            molhos: []
        },
        {
            id: "chimarrao-gaucho",
            name: "Chimarrão Artesanal Gaúcho",
            category: "bebidas",
            price: 22.00,
            image: "assets/images/chimarrao.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
            badges: ["EXPERIÊNCIA DO SUL", "REFIL LIVRE"],
            serving: "Individual generoso + Refil de água quente",
            weight: "Cuia tradicional de porongo",
            description: "Autêntica cuia tradicional de porongo com bomba de alpaca, erva-mate pura folha moída fresca e água aquecida no ponto exato da brasa (75°C). Refil livre durante a visita.",
            acompanhamentos: [],
            molhos: []
        },
        {
            id: "pudim-leite-defumado",
            name: "Pudim de Leite Defumado na Brasa",
            category: "sobremesas",
            price: 26.00,
            image: "assets/images/mural_3.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80",
            badges: ["SOBREMESA EXCLUSIVA", "CARAMELO ÂMBAR"],
            serving: "Fatia generosa",
            weight: "Receita de Vó no Fogo",
            description: "Pudim artesanal de leite condensado assado suavemente no forno a lenha, com calda densa de caramelo âmbar e raspas frescas de limão caipira.",
            acompanhamentos: [],
            molhos: []
        }
    ],

    // Initial items in Table 14 bill (matches the Figma Comanda da Mesa 14)
    initialComanda: [
        {
            id: "feijoada-completa",
            name: "Feijoada Completa da Casa",
            tag: "Acompanha arroz, couve e farofa",
            type: "Individual",
            price: 89.90,
            qty: 1,
            time: "Entregue às 20:05",
            status: "delivered"
        },
        {
            id: "torresmo-de-rolo",
            name: "Torresmo de Rolo Pururuca",
            tag: "Com geleia de pimenta da roça",
            type: "Petisco",
            price: 58.90,
            qty: 1,
            time: "Entregue às 19:58",
            status: "delivered"
        },
        {
            id: "baiao-de-dois",
            name: "Baião de Dois do Sertão",
            tag: "Queijo coalho tostado & carne de sol",
            type: "Para 2 Pessoas",
            price: 74.90,
            qty: 1,
            time: "Entregue às 20:10",
            status: "delivered"
        },
        {
            id: "chopp-puro-malte",
            name: "Chopp Puro Malte 500ml",
            tag: "Caneca ultracongelada (500ml)",
            type: "R$ 18,50 cada",
            price: 18.50,
            qty: 2,
            time: "Entregue às 19:48",
            status: "delivered"
        }
    ],

    // Loyalty passport data (7/8 stamped, 8th unlocked upon payment + photo)
    loyalty: {
        totalStampsNeeded: 8,
        currentStamps: 7, // will become 8 after payment/photo!
        couponCode: "#SEMBANHA-8SELOS-2025",
        rewardName: "Pudim de Leite Defumado na Brasa ou Tábua de Petiscos da Casa",
        rewardDescription: "Pudim artesanal de leite condensado tostado no forno a lenha com calda de caramelo âmbar e raspas de limão caipira. Ou escolha 1x Porção de Torresmo de Rolo na sua próxima visita.",
        validityDays: 30,
        stamps: [
            { number: 1, date: "15/JAN", table: "Mesa 04", server: "Lucas", completed: true },
            { number: 2, date: "02/FEB", table: "Mesa 12", server: "Mateus", completed: true },
            { number: 3, date: "14/FEB", table: "Mesa 14", server: "Lucas", completed: true },
            { number: 4, date: "02/MAR", table: "Mesa 08", server: "Júlia", completed: true },
            { number: 5, date: "17/MAR", table: "Mesa 14", server: "Lucas", completed: true },
            { number: 6, date: "05/ABR", table: "Mesa 22", server: "Thiago", completed: true },
            { number: 7, date: "18/ABR", table: "Mesa 14", server: "Lucas", completed: true },
            { number: 8, date: "HOJE", table: "Mesa 14", server: "Lucas", completed: false } // pending photo & payment
        ]
    },

    // Frames for the Social Camera
    photoFrames: [
        { id: "fogo-brasa", name: "Fogo & Brasa", badge: "🔥 FOGO & BRASA", borderClass: "frame-fire" },
        { id: "vintage-steak", name: "Vintage Steak", badge: "🥩 VINTAGE STEAK", borderClass: "frame-vintage" },
        { id: "noite-epica", name: "Noite Épica", badge: "🍻 NOITE ÉPICA DE RIBS", borderClass: "frame-epic" },
        { id: "pitmaster", name: "Mestre Pitmaster", badge: "⭐ 8º SELO PITMASTER", borderClass: "frame-gold" }
    ],

    // Mural of memories
    mural: [
        {
            id: "mural-1",
            title: "Churrascada Final",
            subtitle: "Mesa 14 · Salão Principal",
            date: "18 de Abr, 2025",
            image: "assets/images/toast-friends.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80",
            tag: "#Mesa14 #FogoEbrasa"
        },
        {
            id: "mural-2",
            title: "Sexta dos Campeões",
            subtitle: "Mesa 22 · Deck Brasa",
            date: "05 de Abr, 2025",
            image: "assets/images/mural_1.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=600&auto=format&fit=crop&q=80",
            tag: "#NoiteEpica #Costela12h"
        },
        {
            id: "mural-3",
            title: "Costela & Amigos",
            subtitle: "Mesa 08 · Lounge BBQ",
            date: "02 de Mar, 2025",
            image: "assets/images/mural_2.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop&q=80",
            tag: "#PitmasterClub"
        },
        {
            id: "mural-4",
            title: "Rodada de Torresmo & Chopp",
            subtitle: "Mesa 12 · Salão",
            date: "02 de Fev, 2025",
            image: "assets/images/mural_chopp.jpg",
            fallbackImage: "https://images.unsplash.com/photo-1574966740793-953ad375f2b3?w=600&auto=format&fit=crop&q=80",
            tag: "#SemBanhaBBQ"
        }
    ]
};
