// COMO ESTAMOS UTILIZANDO JQUERY, TEMOS QUE INICIALIZAR O CÓDIGO COM ESSA LINHA
$(document).ready(function() {

	// CRIA AS VARIÁVEIS NECESSÁRIAS
	// bool é uma booleana, serve para verificar se o professor quer ou não contribuir a partir do que foi informado na primeira pergunta q1
	var bool = false;
	// url serve para armazenar a url gerada
	var url = '';
	// data ativo serve para armazenar a data que o professor considera como ativo
	var data_ativo = '';
	// linguagem selecionada armazena a linguagem que veio do select
	var linguagem_selecionada = '';
	// pagina serve para ir incrementando e ir trazendo mais resultado. OBS: NÃO FOI FEITA PAGINAÇÃO AINDA, APENAS TRAZ PÁGINA 1
	var pagina = 1;

	// INICIALIZA O PLUGIN PARA PESQUISA DE PALAVRAS DENTRO DE UM SELECT (USA NO SELECT DAS LINGUAGENS)
	$("select").select2();

	// ---------------------------------------------
	// QUESTÃO 1 - q1

	// SE O PROFESSOR CLICAR EM SIM
	$("#q1 #btn_sim").click(function(){
		// SETA TRUE NA VARIÁVEL BOOL PARA INFORMAR QUE O MESMO QUER CONTRIBUIR
		bool = true;
		// OCULTA O CONTEÚDO DA PRIMEIRA PERGUNTA, PEGANDO PELO ID '#ID', ESTE VALOR 700 É PRA IR SUMINDO AOS POUCOS, É SEGUNDOS
		// 1000 = 1s
		$("#q1").fadeOut(700);
		// EXIBE O CONTEUDO QUE ESTAVA OCULTO, NO CASO A QUESTAO 2
		$("#q2").fadeIn();
		// AJUSTA O SELECT COM AS LINGUAGENS, PRA AJUSTAR A PÁGINA - BUG QUANDO OCULTA, DIMINUI DE TAMANHO
		$(".language span").css('width', '100%');
	});

	// SE O PROFESSOR CLICAR EM NÃO
	$("#q1 #btn_nao").click(function(){
		// SETA FALSE NA VARIÁVEL BOOL PARA INFORMAR QUE O MESMO NÃO QUER CONTRIBUIR
		bool = false;
		// OCULTA O CONTEÚDO DA PRIMEIRA PERGUNTA, PEGANDO PELO ID '#ID'
		$("#q1").fadeOut(700);
		// EXIBE O CONTEUDO QUE ESTAVA OCULTO, NO CASO A QUESTAO 2
		$("#q2").fadeIn();
		// AJUSTA O SELECT COM AS LINGUAGENS, PRA AJUSTAR A PÁGINA - BUG QUANDO OCULTA, DIMINUI DE TAMANHO
		$(".language span").css('width', '100%');
	});

	// ---------------------------------------------
	// QUESTÃO 2 - q2

	// QUANDO O PROFESSOR CONFIRMA A LINGUAGEM SELECIONADA. 
	// OBS: FALTA BLOQUEAR PARA ELE NÃO CLICAR EM CONFIRMAR SEM ANTES SELECIONAR A LINGUAGEM
	$("#btn_confirmar").click(function(){

		//	OCULTA A QUESTÃO 2
		$("#q2").fadeOut(700);
		// ATRIBUI O VALOR INFORMADO PELO SELECT NA VARIAVEL LINGUAGEM_SELECIONADA
		linguagem_selecionada = $("#linguagem").val();

		// VERIFICO A VARIAVEL BOOL, CASO ELE TENHA CLICADO EM 'SIM' NA Q1, CONTINUA O PROCESSO DE REFINAMENTO DA BUSCA
		if (bool) {
			$("#q3").fadeIn();

		// SE ELE CLICOU EM NÃO EU FAÇO A CONSULTA APENAS INFORMANDO A LINGUAGEM SELECIONADA
		} else {
			// LISTA SOMENTE PELA LINGUAGEM
			url = "https://api.github.com/search/repositories?q=language:"+linguagem_selecionada+"&page="+pagina+"&per_page=10";
			// CHAMO A FUNÇÃO QUE CONTÉM O AJAX PARA REQUISITAR OS DADOS DO GITHUB
			pesquisar();
		}

	});

	// ---------------------------------------------
	// QUESTÃO 3 - q3
	// AQUI PERGUNTA SE O PROFESSOR DESEJA QUE O PROJETO ESTEJA ATIVO
	// SE CLICAR EM SIM
	$("#q3 #btn_sim").click(function(){
		// OCULTA A Q3
		$("#q3").fadeOut(700);
		// EXIBE A Q4
		$("#q4").fadeIn();
	});

	// SE CLICAR EM NÃO
	$("#q3 #btn_nao").click(function(){
		// OCULTA A Q3
		$("#q3").fadeOut(700);
		
		//PREPARO A URL APENAS INFORMANDO A LINGUAGEM
		url = "https://api.github.com/search/repositories?q=language:"+linguagem_selecionada+"&page="+pagina+"&per_page=10";
		// CHAMO A FUNCAO PARA FAZER A REQUISIÇÃO
		pesquisar();
	});

	// ---------------------------------------------
	// QUESTÃO 4 - q4
	// CASO ELE TENHA INFORMADO 'SIM' EM PROJETO ATIVO, PEDE-SE PARA O PROFESSOR INFORMAR A DATA LIMITE QUE CONSIDERA ATIVO.
	// QUANDO O MESMO INFORMA A DATA E CLICA EM CONFIRMAR
	$("#btn_confirmar_data").click(function(){
		// OCULTA A Q4
		$("#q4").fadeOut(700);

		// PEGA A DATA INFORMADA
		data_ativo = $("#data_ativo").val();
		
		// PREPARA A URL PASSANDO A DATA INFORMADA E A LINGUAGEM
		url = 'https://api.github.com/search/repositories?q=pushed:>='+data_ativo+'+language:'+linguagem_selecionada+'&page='+pagina+'&per_page=10';
		// CHAMA A FUNCAO pesquisar(), PARA FAZER A REQUISIÇÃO
		pesquisar();

	});

	// ---------------------------------------------
	// FUNÇÃO QUE FAZ A REQUISIÇÃO A API DO GITHUB VIA HTTP, UTILIZANDO AJAX

	function pesquisar(){
		// INICIALIZA O MÉTODO AJAX VIA JQUERY
		$.ajax({
			// ATRIBUI A VARIÁVEL url GERADA NA CONFIGURAÇÃO DA REQUISIÇÃO AJAX
			url: url,
			// INFORMA O TIPO DE REQUISIÇÃO, NO CASO A FORMA COMO ESTÁ PASSANDO OS DADOS
			// GET -> PELA URL, POST -> POR VARIÁVEIS
			type : "GET",
			// INFORMA O TIPO DE DADOS DE RETORNO, DADOS ESPERADO, NO CASO JSON
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			// CASO A REQUISIÇÃO SEJA REALIZADA COM SUCESSO
			success: function (data) {
				// AQUI EU TRAGO OS DADOS COMPLETOS QUE VIERAM DA API NO CONSOLE, APERTA F12
				console.log (data);
				// CRIO UMA VARIAVEL LOCAL PARA ARMAZENAR O HTML+ DADOS QUE VAI PRA PÁGINA
				var html = '';
				
				// O FOR PERCORRER TODAS AS LINHAS VINDAS NA REQUISIÇÃO, NO CASO 10 REGISTROS					
				for (i = 0; i < data.items.length; i++) {

					html += '<div class="card col-lg-12 col-xs-12"><div class="card-body">'+
							'<h4 class="card-title">' + data.items[i].name + '</h4>' +
							'<p class="card-text">'+
							' - Linguagem de Programação: '+ data.items[i].language +
							//' - Score: '+ data.items[i].score +
							//' - Wiki: '+ data.items[i].wiki +
							' - Quantidade de Forks: '+ data.items[i].forks +
							' - Data de Criação do Projeto: '+ data.items[i].created_at +
							//' - Pushed_at: '+ data.items[i].pushed_at +
							//' - Watchers: '+ data.items[i].watchers +
							' - Endereço do Projeto: <a href="data.items[i].html_url">html_url: '+ data.items[i].html_url +'</a>'+
							'</p></div></div>';
				}
				//	DEPOIS DE IR CONCATENANDO OS REGISTROS NA VARIÁVEL POR ISSO O '+=' EM html.
				//	PASSA A QUANTIDADE DE RESULTADOS PARA A TAG HTML COM O ID msg
				$('#msg').html('Total de Resultados: ' + data.total_count);
				// 	PASSA O CONTEÚDO DA VARIÁVEL PARA A TAG HTML QUE CONTÉM O ID data
				$('#data').html(html);
				
			},
			// CASO A REQUISIÇÃO DÊ ERRO
			error: function(XMLHttpRequest, textStatus, errorThrown) { 
				//EXIBE O ERRO NA PÁGINA
				$('#msg').html("Status: " + textStatus +' - '+ "Error: " + errorThrown);
			}
		});
	}
});