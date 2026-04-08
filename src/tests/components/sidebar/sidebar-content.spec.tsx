/***
 * AAA - Arrange, Act, Assert
 * - Arrange: Configurar o ambiente de teste, criar os dados necessários e renderizar o componente.
 * - Act: Simular as ações do usuário ou eventos que disparam mudanças no componente.
 * - Assert: Verificar se o resultado esperado ocorreu, como mudanças na interface ou chamadas de função.
 *
 * Given, When, Then
 * - Given: Descreve o estado inicial ou as condições prévias para o teste.
 * - When: Descreve a ação ou evento que ocorre durante o teste.
 * - Then: Descreve o resultado esperado após a ação ser executada.
 *
 * Testes de Unidade: Focam em testar uma única unidade de código, como uma função ou componente isolado, garantindo que ele funcione corretamente em diferentes cenários.
 * Testes de Integração: Verificam a interação entre várias unidades de código, como componentes que trabalham juntos, para garantir que eles funcionem corretamente em conjunto.
 * Testes de Interface do Usuário (UI): Avaliam a interface do usuário, verificando se os elementos estão visíveis, se as interações funcionam como esperado e se a experiência do usuário é satisfatória.
 * Testes de Snapshot: Capturam a saída renderizada de um componente e a comparam com uma versão anterior para detectar mudanças inesperadas na interface.
 * Testes de Regressão: Garantem que as mudanças recentes no código não introduzam novos bugs ou quebras em funcionalidades existentes.
 */

import {
  SidebarContent,
  SidebarContentProps,
} from '@/components/sidebar/sidebar-content';
import { render, screen } from '@/lib/test-utils';
import userEvent from '@testing-library/user-event';

const pushMock = jest.fn();
let mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => mockSearchParams,
}));

const initialPrompts = [
  {
    id: '1',
    title: 'Title 01',
    content: 'Content 01',
  },
];

const makeSut = (
  { prompts = initialPrompts }: SidebarContentProps = {} as SidebarContentProps
) => {
  return render(<SidebarContent prompts={prompts} />);
};

describe('SidebarContent', () => {
  const user = userEvent.setup();

  describe('Base', () => {
    it('deveria renderizar o botão para criar um novo prompt', () => {
      // Arrange || Given
      makeSut();

      // Assert || Then
      expect(screen.getByRole('complementary')).toBeVisible();
      expect(screen.getByRole('button', { name: 'Novo prompt' })).toBeVisible();
    });

    it('deveria renderizar a lista de prompts', () => {
      // Arrange || Given
      const input = [
        {
          id: '1',
          title: 'Example 01',
          content: 'Content 01',
        },
        {
          id: '2',
          title: 'Example 02',
          content: 'Content 02',
        },
      ];
      makeSut({ prompts: input });

      // Assert || Then
      expect(screen.getByText(input[0].title)).toBeInTheDocument();
      expect(screen.getAllByRole('paragraph')).toHaveLength(input.length);
    });

    it('deveria atualizar o campo de busca ao digitar', async () => {
      // Arrange || Given
      const text = 'AI';
      makeSut();
      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      // Act || When
      await user.type(searchInput, text);

      // Assert || Then
      expect(searchInput).toHaveValue(text);
    });

    it('deveria renderizar o campo de busca vazio por padrão', () => {
      // Arrange || Given
      makeSut();
      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      // Assert || Then
      expect(searchInput).toHaveValue('');
    });
  });

  describe('Colapsar / Expandir', () => {
    it('deveria iniciar expandida e exibir o botão minimizar', () => {
      // Arrange || Given
      makeSut();
      const aside = screen.getByRole('complementary');
      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });
      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      });

      // Assert || Then
      expect(aside).toBeVisible();
      expect(collapseButton).toBeVisible();
      expect(expandButton).not.toBeInTheDocument();
    });

    it('deveria contrair e mostrar o botão de expandir', async () => {
      // Arrange || Given
      makeSut();
      const collapseButton = screen.getByRole('button', {
        name: /minimizar sidebar/i,
      });

      // Act || When
      await user.click(collapseButton);

      // Assert || Then
      const expandButton = screen.queryByRole('button', {
        name: /expandir sidebar/i,
      });
      expect(expandButton).toBeInTheDocument();

      expect(collapseButton).not.toBeInTheDocument();
    });
  });

  describe('Novo Prompt', () => {
    it('deveria navegar o usuario para a paga de novo prompt /new', async () => {
      // Arrange || Given
      makeSut();
      const newButton = screen.getByRole('button', { name: 'Novo prompt' });

      // Act || When
      await user.click(newButton);

      // Assert || Then
      expect(pushMock).toHaveBeenCalledWith('/new');
    });
  });

  describe('Busca', () => {
    it('deveria navegar com URL codificada ao digitar e limpar', async () => {
      // Arrange || Given
      const text = 'AI & Machine Learning';
      makeSut();
      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      // Act || When
      await user.type(searchInput, text);

      // Assert || Then
      const lastCall = pushMock.mock.calls.at(-1);
      expect(lastCall?.[0]).toBe('/?q=AI%20%26%20Machine%20Learning');

      // Act || When
      await user.clear(searchInput);

      // Assert || Then
      const lastClearCall = pushMock.mock.calls.at(-1);
      expect(lastClearCall?.[0]).toBe('/');
    });

    it('deveria iniciar o campo de busca com o search param da URL, se presente', () => {
      // Arrange || Given
      const text = 'Test Search';
      const searchParams = new URLSearchParams({ q: text });
      mockSearchParams = searchParams;
      makeSut();
      const searchInput = screen.getByPlaceholderText('Buscar prompts...');

      // Assert || Then
      expect(searchInput).toHaveValue(text);
    });
  });
});
