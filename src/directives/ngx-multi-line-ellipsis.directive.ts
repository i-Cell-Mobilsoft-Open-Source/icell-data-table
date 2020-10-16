import { Directive, ElementRef, Input, AfterViewInit, Renderer2 } from '@angular/core';

/**
 * We had to include this as source as the original module is not yet compatible with ngcc.
 *
 * source: https://raw.githubusercontent.com/moonykolo/ngx-multi-line-ellipsis/master/lib/ngx-multi-line-ellipsis.directive.ts
 */
@Directive({
  selector: '[ngxEllipsis]',
})
export class NgxMultiLineEllipsisDirective implements AfterViewInit {
  @Input() lines: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Get element font size
    const elementFontSize = parseInt(this.getCssproperty(this.el.nativeElement, 'font-size').split('px')[0], 10);

    // Get element font family
    const elementFontFamily = this.getCssproperty(this.el.nativeElement, 'font-family').split(',')[0];

    // Get element width
    const originalElementWidth = this.el.nativeElement.clientWidth;

    // Remove the element from DOM
    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');

    // Create a canvas element so it'd be possiable to measure expected width
    const canvas = this.renderer.createElement('canvas');
    const canvasContext = canvas.getContext('2d');

    // Set the current font size and family for more accurate width
    canvasContext.font = `${elementFontSize}px ${elementFontFamily}`;

    // Get element original text (will be replaced in future code lines)
    const elementOriginalText = this.el.nativeElement.innerHTML.trim();

    // Init final top element text
    let topElementTextLines = '';

    // Init final ellipsis text variable
    let ellipsisTextLine = '';

    // A flag veriable to indicate if current words num as reached
    // the required lines num (minus one)
    let hasReachedLimit = false;
    let finishLoop = false;

    // A veriable that holds current width (top element)
    let currentTopElemetWidth = 0;

    // A veriable that holds last text that has only complete words in it
    // to aviod white spaces breaks
    let completeWordsText = '';

    // An array of letters (more accurate measurement by canvas method)
    const allLetters = elementOriginalText.split('');

    // Run on original text string
    for (let i = 0; i < elementOriginalText.length && !finishLoop; i++) {
      // Checks if current width is smaller than
      // the max width for line times the lines to display minus one
      if (currentTopElemetWidth < originalElementWidth * (this.lines - 1) && !hasReachedLimit) {
        // Save the current text as previos text
        const previosText = topElementTextLines;

        // If the current char is 'Space' then it saves the current text
        // as it has only complete words
        if (elementOriginalText.charAt(i) && elementOriginalText.charAt(i) === ' ') {
          completeWordsText = topElementTextLines;
        }

        // Add current char to current text
        topElementTextLines = topElementTextLines + elementOriginalText.charAt(i);

        // Get the new current element width
        currentTopElemetWidth += canvasContext.measureText(allLetters[i]).width;

        if (elementOriginalText.charAt(i) && elementOriginalText.charAt(i) === '\n') {
          currentTopElemetWidth -= canvasContext.measureText(allLetters[i]).width;
        }

        // Checks if current width is bigger or equal to
        // the max width for line times the lines to display minus one
        if (currentTopElemetWidth >= originalElementWidth * (this.lines - 1)) {
          // If the current char is 'Space' it gets
          // the previos text as the final text
          if (elementOriginalText.charAt(i) && elementOriginalText.charAt(i) === ' ') {
            // Set previos text as the current element final text
            topElementTextLines = previosText;

            // Set the ellipsis text line with it's first char
            ellipsisTextLine = elementOriginalText.charAt(i);

            // Else if the current char is NOT 'Space' means there's a broken word
          } else {
            // Set the complete words text string as the element final text
            topElementTextLines = completeWordsText;

            // Get the previos text (to get the last word taht we didn't included)
            const previosTextSplitBySpaces = previosText.split(' ');
            const previosLetter = previosTextSplitBySpaces[previosTextSplitBySpaces.length - 1] + elementOriginalText.charAt(i);

            ellipsisTextLine = previosLetter;
          }

          // Set flag to true so now it'll start to fill ellipsis element
          hasReachedLimit = true;

          // Set the ellipsis text line with it's first word and current char
        }

        // Finish to fill the top element
      } else {
        // If Next char is 'Space' then saves the current string
        // as complete words string
        if (elementOriginalText.charAt(i + 1) && elementOriginalText.charAt(i + 1) === ' ') {
          completeWordsText = topElementTextLines;
        }

        // Add current char to ellipsis text
        ellipsisTextLine = ellipsisTextLine + elementOriginalText.charAt(i);

        // Get the new current element width
        currentTopElemetWidth += canvasContext.measureText(allLetters[i]).width;

        if (originalElementWidth * this.lines - currentTopElemetWidth < -100) {
          finishLoop = true;
        }
      }
    }

    // Create the top element to append
    const topTextDiv = this.renderer.createElement('div');
    const topText = this.renderer.createText(topElementTextLines.trim());
    this.renderer.appendChild(topTextDiv, topText);

    // Create the ellipsis elemet to append
    const ellipsisDiv = this.renderer.createElement('div');
    const ellipsisText = this.renderer.createText(ellipsisTextLine.trim());

    this.renderer.setStyle(ellipsisDiv, 'overflow', 'hidden');
    this.renderer.setStyle(ellipsisDiv, 'white-space', 'nowrap');
    this.renderer.setStyle(ellipsisDiv, 'text-overflow', 'ellipsis');
    this.renderer.appendChild(ellipsisDiv, ellipsisText);

    // Append both elements to the original element
    this.el.nativeElement.innerHTML = '';
    this.renderer.appendChild(this.el.nativeElement, topTextDiv);
    this.renderer.appendChild(this.el.nativeElement, ellipsisDiv);

    this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
  }

  getCssproperty(element: Element, property: string) {
    return getComputedStyle(element, null).getPropertyValue(property);
  }
}
