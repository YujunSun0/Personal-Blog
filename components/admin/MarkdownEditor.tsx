'use client';

import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { PostContent } from '@/components/post/PostContent';
import { toast } from 'sonner';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 현재 줄의 시작과 끝 위치 찾기
  const getCurrentLine = (position: number) => {
    const textBefore = content.substring(0, position);
    const textAfter = content.substring(position);
    const lineStart = textBefore.lastIndexOf('\n') + 1;
    const lineEnd = textAfter.indexOf('\n');
    const lineEndPos = lineEnd === -1 ? content.length : position + lineEnd;
    const lineText = content.substring(lineStart, lineEndPos);
    return { lineStart, lineEnd: lineEndPos, lineText };
  };

  // 제목 문법 제거 (줄 시작의 # 제거)
  const removeHeadingSyntax = (lineText: string): string => {
    return lineText.replace(/^#+\s*/, '');
  };

  // 제목 문법이 있는지 확인
  const hasHeadingSyntax = (lineText: string): boolean => {
    return /^#+\s/.test(lineText);
  };

  // 마크다운 문법 토글 함수 (굵기, 기울임, 취소선)
  const toggleMarkdownSyntax = (syntax: 'bold' | 'italic' | 'strikethrough') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    // 문법 매핑
    const syntaxMap = {
      bold: { before: '**', after: '**', placeholder: '텍스트' },
      italic: { before: '*', after: '*', placeholder: '텍스트' },
      strikethrough: { before: '~~', after: '~~', placeholder: '텍스트' },
    };

    const { before, after, placeholder } = syntaxMap[syntax];

    if (selectedText) {
      // 선택된 텍스트 앞뒤의 문맥 확인
      const textBefore = content.substring(0, start);
      const textAfter = content.substring(end);
      
      // 선택된 텍스트 앞에 문법이 있는지 확인
      const hasBeforeSyntax = textBefore.endsWith(before);
      // 선택된 텍스트 뒤에 문법이 있는지 확인
      const hasAfterSyntax = textAfter.startsWith(after);
      
      // 선택된 텍스트 자체가 문법으로 시작/끝나는지 확인
      const startsWithSyntax = selectedText.startsWith(before);
      const endsWithSyntax = selectedText.endsWith(after);
      
      // 이미 문법으로 감싸져 있는지 확인
      const isWrapped = 
        (hasBeforeSyntax && hasAfterSyntax) || // 앞뒤에 문법이 있음
        (startsWithSyntax && endsWithSyntax); // 선택된 텍스트 자체가 문법 포함

      let newText: string;
      let newStart: number;
      let newEnd: number;

      if (isWrapped) {
        // 문법 제거
        if (hasBeforeSyntax && hasAfterSyntax) {
          // 앞뒤에 문법이 있는 경우
          newText =
            textBefore.slice(0, -before.length) +
            selectedText +
            textAfter.slice(after.length);
          newStart = start - before.length;
          newEnd = newStart + selectedText.length;
        } else {
          // 선택된 텍스트 자체가 문법 포함
          const unwrappedText = selectedText.slice(before.length, -after.length);
          newText =
            textBefore +
            unwrappedText +
            textAfter;
          newStart = start;
          newEnd = start + unwrappedText.length;
        }
      } else {
        // 문법 추가
        newText =
          textBefore +
          before +
          selectedText +
          after +
          textAfter;
        newStart = start + before.length;
        newEnd = newStart + selectedText.length;
      }

      onChange(newText);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newStart, newEnd);
      }, 0);
    } else {
      // 선택된 텍스트가 없는 경우: placeholder 삽입하고 선택
      const newText =
        content.substring(0, start) +
        before +
        placeholder +
        after +
        content.substring(end);

      onChange(newText);

      setTimeout(() => {
        const newStart = start + before.length;
        const newEnd = newStart + placeholder.length;
        textarea.focus();
        textarea.setSelectionRange(newStart, newEnd);
      }, 0);
    }
  };

  // 텍스트 삽입 헬퍼 함수 (링크, 이미지, 코드용)
  const insertText = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    // 선택된 텍스트가 있으면 그대로 사용, 없으면 placeholder 사용
    const textToWrap = selectedText || placeholder;
    
    const newText =
      content.substring(0, start) +
      before +
      textToWrap +
      after +
      content.substring(end);

    onChange(newText);

    // 커서 위치 조정
    setTimeout(() => {
      if (selectedText) {
        // 텍스트가 선택되어 있으면 전체 선택 영역 유지
        const newStart = start + before.length;
        const newEnd = newStart + selectedText.length;
        textarea.focus();
        textarea.setSelectionRange(newStart, newEnd);
      } else {
        // 텍스트가 없으면 placeholder 끝에 커서 위치
        const newCursorPos = start + before.length + textToWrap.length + after.length;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  // 제목 삽입/변경 함수
  const insertHeading = (level: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const { lineStart, lineEnd, lineText } = getCurrentLine(cursorPos);
    
    // 제목 문법 생성 (# + 공백)
    const headingSyntax = '#'.repeat(level) + ' ';
    
    // 현재 줄에 제목이 있는지 확인
    let newLineText: string;
    let newCursorPos: number;
    
    if (hasHeadingSyntax(lineText)) {
      // 기존 제목 제거하고 새 제목 문법 추가
      const textWithoutHeading = removeHeadingSyntax(lineText);
      newLineText = headingSyntax + textWithoutHeading;
      newCursorPos = lineStart + headingSyntax.length + (cursorPos - lineStart);
    } else {
      // 줄 시작에 제목 문법 추가
      newLineText = headingSyntax + lineText;
      newCursorPos = lineStart + headingSyntax.length + (cursorPos - lineStart);
    }

    const newText =
      content.substring(0, lineStart) +
      newLineText +
      content.substring(lineEnd);

    onChange(newText);

    // 커서 위치 조정
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 인용구 토글 함수 (여러 줄 지원)
  const toggleQuote = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // 선택된 영역의 시작과 끝 줄 찾기
    const textBeforeStart = content.substring(0, start);
    const textAfterEnd = content.substring(end);
    
    const startLineStart = textBeforeStart.lastIndexOf('\n') + 1;
    const endLineEnd = textAfterEnd.indexOf('\n');
    const endLineEndPos = endLineEnd === -1 ? content.length : end + endLineEnd;
    
    // 선택된 영역의 모든 줄 가져오기
    const selectedLinesText = content.substring(startLineStart, endLineEndPos);
    const lines = selectedLinesText.split('\n');
    
    // 모든 줄이 인용구인지 확인 (빈 줄 제외)
    const nonEmptyLines = lines.filter(line => line.trim() !== '');
    const allLinesAreQuotes = nonEmptyLines.length > 0 && nonEmptyLines.every(line => line.startsWith('> '));
    
    let newLines: string[];
    let offset = 0;
    
    if (allLinesAreQuotes) {
      // 모든 줄이 인용구면 제거
      newLines = lines.map(line => {
        if (line.trim() === '') return line;
        return line.startsWith('> ') ? line.substring(2) : line;
      });
      offset = -2;
    } else {
      // 기본 동작: 첫 번째 줄만 `> ` 추가
      // 하지만 마크다운 표준에 맞춰 나머지 줄들도 `> `를 추가해야 하나의 블록으로 인식됨
      const firstNonEmptyLineIndex = lines.findIndex(line => line.trim() !== '');
      
      if (firstNonEmptyLineIndex === -1) {
        // 모든 줄이 빈 줄이면 첫 줄에만 추가
        newLines = lines.map((line, index) => {
          if (index === 0) {
            return '> ' + line;
          }
          return line;
        });
        offset = 2;
      } else {
        const firstLine = lines[firstNonEmptyLineIndex];
        
        if (firstLine.startsWith('> ')) {
          // 첫 줄이 이미 인용구면, 모든 줄에 추가 (사용자가 수동으로 각 줄에 추가한 경우 대응)
          newLines = lines.map(line => {
            if (line.trim() === '') return line;
            return line.startsWith('> ') ? line : '> ' + line;
          });
          offset = 2;
        } else {
          // 기본 동작: 첫 번째 줄과 연속된 줄들에 `> ` 추가
          // 빈 줄을 만나면 인용구 블록 종료
          let inQuoteBlock = false;
          newLines = lines.map((line, index) => {
            if (index === firstNonEmptyLineIndex) {
              inQuoteBlock = true;
              return '> ' + line;
            }
            if (inQuoteBlock) {
              if (line.trim() === '') {
                // 빈 줄은 그대로 유지 (인용구 블록 종료)
                inQuoteBlock = false;
                return line;
              }
              // 연속된 줄들도 인용구로 추가
              return '> ' + line;
            }
            return line;
          });
          offset = 2;
        }
      }
    }
    
    const newSelectedText = newLines.join('\n');
    const newText =
      content.substring(0, startLineStart) +
      newSelectedText +
      content.substring(endLineEndPos);

    onChange(newText);

    // 커서 위치 조정
    setTimeout(() => {
      textarea.focus();
      if (start === end) {
        // 단일 커서 위치
        const newPos = Math.max(startLineStart, start + offset);
        textarea.setSelectionRange(newPos, newPos);
      } else {
        // 선택 영역 유지
        const newStart = Math.max(startLineStart, start + (allLinesAreQuotes ? offset : 0));
        const newEnd = Math.min(endLineEndPos, end + (allLinesAreQuotes ? offset * lines.length : 0));
        textarea.setSelectionRange(newStart, newEnd);
      }
    }, 0);
  };

  // 이미지 업로드 함수
  const handleImageUpload = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'posts');

      const uploadResponse = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || '이미지 업로드 실패');
      }

      const { url } = await uploadResponse.json();

      // 현재 커서 위치에 이미지 마크다운 삽입
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        
        // 선택된 텍스트가 있으면 이미지 설명으로 사용, 없으면 파일명 사용
        const imageAlt = selectedText || file.name.replace(/\.[^/.]+$/, '');
        const imageMarkdown = `![${imageAlt}](${url})`;
        
        const newText =
          content.substring(0, start) +
          imageMarkdown +
          content.substring(end);

        onChange(newText);

        // 커서를 이미지 마크다운 뒤로 이동
        setTimeout(() => {
          const newCursorPos = start + imageMarkdown.length;
          textarea.focus();
          textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
      }

      toast.success('이미지가 업로드되었습니다.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 이미지 파일 선택 핸들러
  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    await handleImageUpload(file);
  };

  // 툴바 버튼 핸들러
  const handleToolbarClick = (action: string) => {
    switch (action) {
      case 'h1':
        insertHeading(1);
        break;
      case 'h2':
        insertHeading(2);
        break;
      case 'h3':
        insertHeading(3);
        break;
      case 'h4':
        insertHeading(4);
        break;
      case 'bold':
        toggleMarkdownSyntax('bold');
        break;
      case 'italic':
        toggleMarkdownSyntax('italic');
        break;
      case 'strikethrough':
        toggleMarkdownSyntax('strikethrough');
        break;
      case 'quote':
        toggleQuote();
        break;
      case 'link':
        insertText('[', '](url)', '링크 텍스트');
        break;
      case 'image':
        // 이미지 업로드를 위해 파일 선택 다이얼로그 열기
        fileInputRef.current?.click();
        break;
      case 'code':
        // 코드 블록: 여러 줄 선택 시 감싸기, 아니면 블록 생성
        const textarea = textareaRef.current;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const selectedText = content.substring(start, end);
          
          if (selectedText.includes('\n')) {
            // 여러 줄 선택 시 감싸기
            insertText('```\n', '\n```');
          } else {
            // 단일 줄이면 인라인 코드 또는 블록
            insertText('```\n', '\n```', '코드');
          }
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageFileSelect}
        className="hidden"
      />
      {/* 툴바 */}
      <div className="flex items-center gap-2 p-3 border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]">
        <button
          type="button"
          onClick={() => handleToolbarClick('h1')}
          className="px-2 py-1 text-sm font-semibold hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
          title="제목 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => handleToolbarClick('h2')}
          className="px-2 py-1 text-sm font-semibold hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
          title="제목 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => handleToolbarClick('h3')}
          className="px-2 py-1 text-sm font-semibold hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
          title="제목 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => handleToolbarClick('h4')}
          className="px-2 py-1 text-sm font-semibold hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
          title="제목 4"
        >
          H4
        </button>
        <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
        <button
          type="button"
          onClick={() => handleToolbarClick('bold')}
          className="px-2 py-1 text-sm font-bold hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
          title="굵게"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => handleToolbarClick('italic')}
          className="px-2 py-1 text-sm italic hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
          title="기울임"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => handleToolbarClick('strikethrough')}
          className="px-2 py-1 text-sm line-through hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
          title="취소선"
        >
          S
        </button>
        <div className="w-px h-6 bg-[var(--color-border)] mx-1" />
        <button
          type="button"
          onClick={() => handleToolbarClick('quote')}
          className="px-2 py-1 text-sm hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
          title="인용구"
        >
          "
        </button>
        <button
          type="button"
          onClick={() => handleToolbarClick('link')}
          className="px-2 py-1 text-sm hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
          title="링크"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => handleToolbarClick('image')}
          disabled={uploading}
          className="px-2 py-1 text-sm hover:bg-[var(--color-bg-secondary)] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={uploading ? '업로드 중...' : '이미지 업로드'}
        >
          {uploading ? '⏳' : '🖼️'}
        </button>
        <button
          type="button"
          onClick={() => handleToolbarClick('code')}
          className="px-2 py-1 text-sm hover:bg-[var(--color-bg-secondary)] rounded transition-colors font-mono"
          title="코드 블록"
        >
          {'<>'}
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-3 py-1 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] rounded transition-colors"
        >
          {showPreview ? '미리보기 숨기기' : '미리보기 보기'}
        </button>
      </div>

      {/* 에디터 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 마크다운 입력 영역 */}
        <div className={`flex flex-col ${showPreview ? 'w-1/2' : 'w-full'} border-r border-[var(--color-border)]`}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 w-full p-6 resize-none outline-none font-mono text-sm bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] leading-relaxed"
            placeholder="내용을 입력하세요...&#10;&#10;마크다운 문법을 사용할 수 있습니다.&#10;# 제목&#10;**굵게** *기울임*&#10;- 리스트&#10;```코드 블록```"
            style={{ tabSize: 2 }}
          />
        </div>

        {/* 미리보기 영역 */}
        {showPreview && (
          <div className="w-1/2 overflow-y-auto bg-[var(--color-bg-primary)]">
            <div className="max-w-[var(--container-max-width)] mx-auto px-[var(--container-padding-x)] py-8">
              <PostContent content={content || '*내용을 입력하면 미리보기가 표시됩니다.*'} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

