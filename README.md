# Projeto Integrador II - Sistema de administração de vendas


Esse projeto foi desenvolvido como parte da disciplina de Projeto Integrador II, na [UNIVESP - Universidade Virtual do Estado de São Paulo](https://univesp.br/). A disciplina faz parte de grade curricular dos [cursos](https://univesp.br/cursos) superiores no eixo de computação. 

O projeto entrega um sistema para cadastro de clientes e vendas, além da visibilidade dos números relevantes para o negócio, apresentados em um dashboard na tela principal.

O Sistema foi dividido em 2 partes. Essa é a parte do frontend que foi escrito em [JavaScript](https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/First_steps/What_is_JavaScript), [HTML](https://developer.mozilla.org/pt-BR/docs/Web/HTML) e [CSS](https://developer.mozilla.org/pt-BR/docs/Web/CSS)

O sistema contém uma página para cadastro de clientes, uma página para cadastro de vendas, uma página de login, além do dashboard. 

É possível visualizar o sistema nesse [link](https://galemagalhaes.github.io/projetoIntegradorFrontend/) no Github Pages




## Guia para utilização do sistema

### Pontos importantes:

- O projeto está hospedado em uma plataforma gratuita, por isso tem certas limitações, incluindo o fato de que pode levar um pouco mais de tempo para carregar a página no primeiro acesso;
- Não é permitido o acesso sem estar logado, por isso é necessário criar um usuário ou fazer uso de um já cadastrado;
- Foram tomadas algumas medidas de segurança para que os dados não fiquem expostos na internet, ainda assim, é aconselhável o uso de dados *fake*, por se tratar de um projeto acadêmico;
- Todos os dados já carregados no banco são *fake*
  

### Padrões utilizados
| Padrão             | Formato                                  |
| ------------------ | ---------------------------------------- |
| Padrão de email    | email@email.com                          |
| Padrão de CPF      | 000.000.000-00 ou 00000000000            |
| Padrão de senha    | 6 a 8 dígitos                            |
| Padrão de telefone | 10 a 11 dígitos numéricos, incluindo DDD |


### Passo a passo:

#### Tela inicial
Na tela inicial (login) é necessário validar as credenciais.
Se já tiver um usuário cadastrado é só inserir email e senha e clicar em **LOGIN**.

Caso não tenha um usuário, será necessário criar um em **Cadastrar novo usuário**. Será aberta uma nova tela onde devem ser preenchidos os dados do usuário:

- nome;
- email;
- senha;
- confirmar senha

Em seguida clique em **Confirmar**. 

Na sequência irá aparecer uma mensagem de sucesso e a tela será redirecionada ao login onde deve ser seguida a instrução anterior.

#### Tela de clientes
Na tela de clientes há um campo para adicionar um novo cliente. Ao clicar no botão **Adicionar Cliente** será aberto uma formulário para preenchimento dos dados:

- CPF do cliente, que aceita somente números ou números com pontuação padrão
- Nome do cliente
- email
- telefone que aceita entre 10 e 11 dígitos numéricos, incluindo DDD
  
Para criar um novo cliente todos os campos devem ser preenchidos e para gerar um CPF válido, pode ser utilizado um gerador de CPF online, como por exemplo o [gerador do 4devs](https://www.4devs.com.br/gerador_de_cpf#google_vignette ). O CPF pode ser gerado com ou sem pontuação.

A página exibe uma tabela de clientes que podem ser filtrados por nome ou por CPF.

É possível ainda realizar a atualização dos dados do cliente clicando no botão **Atualizar** na mesma linha do cliente que deve ser atualizado. Isso irá abrir uma tela já com os dados do cliente carregados, apenas o CPF não é acessível, os outros dados podem ser atualizados. 

Ao clicar em **Confirmar**, o usuário será retornado à tela de clientes. 

#### Tela de vendas
Na tela de vendas é possível adicionar uma nova venda seguindo esses passos:
- escolha um cliente na lista de clientes;
- insira a data da venda 
- o valor da venda
- Clique em **Adicionar Venda**.


Da mesma maneira que na tela de clientes é exibida uma tabela com a lista de vendas e é possível filtrar as vendas pelo nome do cliente

Também é possível nessa tela realizar a atualização da venda, podendo modificar o campo data, valor ou o status da venda. 

Depois de feitas as alterações desejadas, clique em **Confirmar**

>Toda nova venda é criada com status **Pendente**, por padrão, por isso, esse campo deve ser atualizado após a conclusão da venda.

Por fim, para sair do sistema clique no botão **Sair** no canto superior direito. Isso irá redirecionar o usuário à tela de login
