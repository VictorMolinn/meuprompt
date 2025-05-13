import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-barlow text-gray-800 dark:text-white mb-8">
          Política de Privacidade
        </h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <h2>1. Introdução</h2>
          <p>
            A EIAIFLIX está comprometida em proteger sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais.
          </p>

          <h2>2. Informações que Coletamos</h2>
          <p>
            Coletamos os seguintes tipos de informação:
          </p>
          <ul>
            <li>Informações de cadastro (nome, e-mail)</li>
            <li>Informações da empresa</li>
            <li>Dados de uso da plataforma</li>
            <li>Informações de pagamento</li>
          </ul>

          <h2>3. Como Usamos suas Informações</h2>
          <p>
            Utilizamos suas informações para:
          </p>
          <ul>
            <li>Personalizar sua experiência na plataforma</li>
            <li>Processar pagamentos</li>
            <li>Enviar atualizações importantes</li>
            <li>Melhorar nossos serviços</li>
          </ul>

          <h2>4. Compartilhamento de Dados</h2>
          <p>
            Não vendemos suas informações pessoais. Compartilhamos dados apenas:
          </p>
          <ul>
            <li>Com provedores de serviço necessários</li>
            <li>Quando exigido por lei</li>
            <li>Com seu consentimento explícito</li>
          </ul>

          <h2>5. Segurança dos Dados</h2>
          <p>
            Implementamos medidas de segurança para proteger suas informações:
          </p>
          <ul>
            <li>Criptografia de dados</li>
            <li>Acesso restrito a funcionários</li>
            <li>Monitoramento regular</li>
            <li>Backups seguros</li>
          </ul>

          <h2>6. Seus Direitos</h2>
          <p>
            Você tem direito a:
          </p>
          <ul>
            <li>Acessar seus dados</li>
            <li>Corrigir informações incorretas</li>
            <li>Solicitar exclusão de dados</li>
            <li>Retirar consentimento</li>
          </ul>

          <h2>7. Cookies</h2>
          <p>
            Usamos cookies para:
          </p>
          <ul>
            <li>Manter sua sessão ativa</li>
            <li>Lembrar suas preferências</li>
            <li>Analisar o uso da plataforma</li>
          </ul>

          <h2>8. Alterações</h2>
          <p>
            Podemos atualizar esta política periodicamente. Alterações significativas serão notificadas por e-mail ou através da plataforma.
          </p>

          <h2>9. Contato</h2>
          <p>
            Para questões sobre privacidade, entre em contato através do e-mail: suporte@eiaiflix.com.br
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;