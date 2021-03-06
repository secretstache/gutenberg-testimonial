/**
 * BLOCK: testimonial-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './style.scss';
import './editor.scss';

import classnames from 'classnames';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { Fragment } = wp.element;
const { RichText, BlockControls, MediaUpload } = wp.editor;
const { Toolbar, Button, IconButton } = wp.components;

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-testimonial-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'testimonial-block - CGB Block' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'testimonial-block — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],
	attributes: {
		quote: {
			source: 'html',
			selector: 'p',
		},
		source: {
			source: 'text',
			selector: 'cite',
		},
		quoteSign: {
			source: 'attribute',
			selector: 'blockquote',
			attribute: 'data-quote-sign',
		},
		imageUrl: {
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
		},
		imageAlt: {
			source: 'attribute',
			selector: 'img',
			attribute: 'alt',
		},
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: function( { className, attributes, setAttributes } ) {
		const withQuoteSign = !! attributes.quoteSign;
		const onSelectImage = ( media ) => {
			setAttributes( { imageUrl: media.url } );
		};

		return (
			<div>
				<BlockControls key="control">
					<Toolbar controls={ [
						{
							icon: 'editor-quote',
							title: __( 'Add quote sign' ),
							onClick: () => setAttributes( { quoteSign: ! withQuoteSign } ),
							isActive: withQuoteSign,
						},
					] }>
						<MediaUpload
							type="image"
							onSelect={ onSelectImage }
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ __( 'Add image' ) }
									icon="format-image"
									onClick={ open }
								/>
							) }
						/>
					</Toolbar>
				</BlockControls>

				<div className={ className }>
					{
						attributes.imageUrl ? (
							<Fragment>
								<img src={ attributes.imageUrl } alt={ attributes.imageAlt } />
								<Button
									onClick={ () => setAttributes( { imageUrl: null, imageAlt: null } ) }
									className="button"
									isSmall
								>
									Remove Image
								</Button>
							</Fragment>
						) : ''
					}

					<blockquote
						className={ classnames( { 'with-quote': withQuoteSign } ) }
					>
						<RichText
							format="string"
							tagName="p"
							placeholder="Insert quote here..."
							value={ attributes.quote }
							onChange={ ( quote ) => setAttributes( { quote } ) }
						/>
						<footer>
							<RichText
								tagName="cite"
								placeholder="Source"
								value={ attributes.source }
								onChange={ ( source ) => setAttributes( { source } ) }
							/>
						</footer>
					</blockquote>
				</div>
			</div>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function( { className, attributes } ) {
		const withQuoteSign = !! attributes.quoteSign;

		return (
			<div className={ classnames( className, { 'with-quote': withQuoteSign } ) }>
				{ attributes.imageUrl ? (
					<img src={ attributes.imageUrl } alt={ attributes.imageAlt } />
				) : '' }

				<blockquote
					data-quote-sign={ withQuoteSign }
				>
					<RichText.Content
						tagName="p"
						value={ attributes.quote }
					/>
					<footer>
						<RichText.Content
							tagName="cite"
							value={ attributes.source }
						/>
					</footer>
				</blockquote>
			</div>
		);
	},
} );
