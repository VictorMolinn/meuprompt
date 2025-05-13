import React from 'react';

const TermsOfUse: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold font-barlow text-gray-800 dark:text-white mb-8">
          Termos de Uso
        </h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <h2>1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar a EIAIFLIX, você concorda com estes termos de uso. Se você não concordar com qualquer parte destes termos, não use nossos serviços.
          </p>

          <h2>2. Descrição do Serviço</h2>
          <p>
            A EIAIFLIX é uma plataforma que oferece prompts personalizados para uso com inteligência artificial. Nosso serviço inclui:
          </p>
          <ul>
            <li>Acesso a uma biblioteca de prompts pré-configurados</li>
            <li>Personalização de prompts para seu negócio</li>
            <li>Recursos premium para assinantes</li>
          </ul>

          <h2>3. Contas de Usuário</h2>
          <p>
            Para usar nossos serviços, você precisa criar uma conta. Você é responsável por:
          </p>
          <ul>
            <li>Manter a confidencialidade de sua senha</li>
            <li>Todas as atividades que ocorrem em sua conta</li>
            <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
          </ul>

          <h2>4. Uso Aceitável</h2>
          <p>
            Você concorda em não:
          </p>
          <ul>
            <li>Usar nossos serviços para fins ilegais</li>
            <li>Compartilhar sua conta com terceiros</li>
            <li>Tentar acessar áreas restritas do sistema</li>
            <li>Revender ou redistribuir nossos prompts</li>
          </ul>

          <h2>5. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo disponível na EIAIFLIX, incluindo mas não limitado a textos, gráficos, logos, ícones, imagens e prompts, são propriedade da EIAIFLIX ou de seus licenciadores.
          </p>

          <h2>6. Limitação de Responsabilidade</h2>
          <p>
            A EIAIFLIX não garante que:
          </p>
          <ul>
            <li>O serviço será ininterrupto ou livre de erros</li>
            <li>Os resultados obtidos serão precisos ou confiáveis</li>
            <li>A qualidade dos prompts atenderá suas expectativas</li>
          </ul>

          <h2>7. Modificações</h2>
          <p>
            Reservamos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas através de nosso site ou por e-mail.
          </p>

          <h2>8. Contato</h2>
          <p>
            Para questões sobre estes termos, entre em contato através do e-mail: suporte@eiaiflix.com.br
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;