﻿/*
MIT License
Original code in C# @ https://github.com/davidmchapman/3DContainerPacking
Copyright (c) 2019 davidmchapman

Modified and converted to JavaScript
Copyright (c) 2020 wild-ig
*/ 

/// <summary>
/// Attempts to pack the specified containers with the specified items using the specified algorithms.
/// </summary>
/// <param name="containers">The list of containers to pack.</param>
/// <param name="packingList">The items to pack.</param>
/// <param name="algorithmTypeIDs">The list of algorithm type IDs to use for packing.</param>
/// <returns>A container packing result with lists of the packed and unpacked items.</returns>
function Pack(containers, packingList, algorithmTypeIDs)
{
	class ScrapPad
	{
		/// <summary>
		/// Gets or sets the x coordinate of the gap's right corner.
		/// </summary>
		/// <value>
		/// The x coordinate of the gap's right corner.
		/// </value>
		CumX = 0;

		/// <summary>
		/// Gets or sets the z coordinate of the gap's right corner.
		/// </summary>
		/// <value>
		/// The z coordinate of the gap's right corner.
		/// </value>
		CumZ = 0;

		/// <summary>
		/// Gets or sets the following entry.
		/// </summary>
		/// <value>
		/// The following entry.
		/// </value>
		Post = null;

		/// <summary>
		/// Gets or sets the previous entry.
		/// </summary>
		/// <value>
		/// The previous entry.
		/// </value>
		Pre = null;
	}

	/// <summary>
	/// Runs the packing algorithm.
	/// </summary>
	/// <param name="container">The container to pack items into.</param>
	/// <param name="items">The items to pack.</param>
	/// <returns>The bin packing result.</returns>
	function Run(container, items)
	{
		Initialize(container, items);
		ExecuteIterations(container);
		Report(container);

		let result = {
			AlgorithmID: 1,
			AlgorithmName: "EB-AFIT",
			IsCompletePack: false,
			PackedItems: [],
			PackTimeInMilliseconds: 0,
			PercentContainerVolumePacked: 100,
			PercentItemVolumePacked: 100,
			UnpackedItems: []
		};

		for (let i = 1; i <= itemsToPackCount; i++)
		{
			itemsToPack[i].Quantity = 1;

			if (!itemsToPack[i].IsPacked)
			{
				result.UnpackedItems.push(itemsToPack[i]);
			}
		}

		result.PackedItems = itemsPackedInOrder;
		
		if (result.UnpackedItems.Count == 0)
		{
			result.IsCompletePack = true;
		}

		return result;
	}

	let itemsToPack = [];
	let itemsPackedInOrder = [];
	let layers = [];
	let = [];

	let scrapfirst = new ScrapPad();
	let smallestZ = new ScrapPad();
	let trash = new ScrapPad();

	let evened = false;
	let hundredPercentPacked = false;
	let layerDone = false;
	let packing = false;
	let packingBest = false;
	let quit = false;

	let bboxi = 0;
	let bestIteration = 0;
	let bestVariant = 0;
	let boxi = 0;
	let cboxi = 0;
	let layerListLen = 0;
	let packedItemCount = 0;
	let x = 0;

	let bbfx = 0;
	let bbfy = 0;
	let bbfz = 0;
	let bboxx = 0;
	let bboxy = 0;
	let bboxz = 0;
	let oorient = 'XYZ';
	let bfx = 0;
	let bfy = 0;
	let bfz = 0;
	let boxx = 0;
	let boxy = 0;
	let boxz = 0;
	let orient = 'XYZ';
	let cboxx = 0;
	let cboxy = 0;
	let cboxz = 0;
	let corient = 'XYZ';
	let layerinlayer = 0;
	let layerThickness = 0;
	let lilz = 0;
	let packedVolume = 0;
	let packedy = 0;
	let prelayer = 0;
	let prepackedy = 0;
	let preremainpy = 0;
	let px = 0;
	let py = 0;
	let pz = 0;
	let remainpy = 0;
	let remainpz = 0;
	let itemsToPackCount = 0;
	let totalItemVolume = 0;
	let totalContainerVolume = 0;

	/// <summary>
	/// Analyzes each unpacked box to find the best fitting one to the empty space given.
	/// </summary>
	function AnalyzeBox(hmx, hy, hmy, hz, hmz, dim1, dim2, dim3, dir)
	{
		if (dim1 <= hmx && dim2 <= hmy && dim3 <= hmz)
		{
			if (dim2 <= hy)
			{
				if (hy - dim2 < bfy)
				{
					boxx = dim1;
					boxy = dim2;
					boxz = dim3;
					orient = dir;
					bfx = hmx - dim1;
					bfy = hy - dim2;
					bfz = Math.abs(hz - dim3);
					boxi = x;
				}
				else if (hy - dim2 == bfy && hmx - dim1 < bfx)
				{
					boxx = dim1;
					boxy = dim2;
					boxz = dim3;
					orient = dir;
					bfx = hmx - dim1;
					bfy = hy - dim2;
					bfz = Math.abs(hz - dim3);
					boxi = x;
				}
				else if (hy - dim2 == bfy && hmx - dim1 == bfx && Math.abs(hz - dim3) < bfz)
				{
					boxx = dim1;
					boxy = dim2;
					boxz = dim3;
					orient = dir;
					bfx = hmx - dim1;
					bfy = hy - dim2;
					bfz = Math.abs(hz - dim3);
					boxi = x;
				}
			}
			else
			{
				if (dim2 - hy < bbfy)
				{
					bboxx = dim1;
					bboxy = dim2;
					bboxz = dim3;
					oorient = dir;
					bbfx = hmx - dim1;
					bbfy = dim2 - hy;
					bbfz = Math.abs(hz - dim3);
					bboxi = x;
				}
				else if (dim2 - hy == bbfy && hmx - dim1 < bbfx)
				{
					bboxx = dim1;
					bboxy = dim2;
					bboxz = dim3;
					oorient = dir;
					bbfx = hmx - dim1;
					bbfy = dim2 - hy;
					bbfz = Math.abs(hz - dim3);
					bboxi = x;
				}
				else if (dim2 - hy == bbfy && hmx - dim1 == bbfx && Math.abs(hz - dim3) < bbfz)
				{
					bboxx = dim1;
					bboxy = dim2;
					bboxz = dim3;
					oorient = dir;
					bbfx = hmx - dim1;
					bbfy = dim2 - hy;
					bbfz = Math.abs(hz - dim3);
					bboxi = x;
				}
			}
		}
	}

	/// <summary>
	/// After finding each box, the candidate boxes and the condition of the layer are examined.
	/// </summary>
	function CheckFound()
	{
		evened = false;

		if (boxi != 0)
		{
			cboxi = boxi;
			cboxx = boxx;
			cboxy = boxy;
			cboxz = boxz;
			corient = orient;
		}
		else
		{
			if ((bboxi > 0) && (layerinlayer != 0 || (smallestZ.Pre == null && smallestZ.Post == null)))
			{
				if (layerinlayer == 0)
				{
					prelayer = layerThickness;
					lilz = smallestZ.CumZ;
				}

				cboxi = bboxi;
				cboxx = bboxx;
				cboxy = bboxy;
				cboxz = bboxz;
				corient = oorient;
				layerinlayer = layerinlayer + bboxy - layerThickness;
				layerThickness = bboxy;
			}
			else
			{
				if (smallestZ.Pre == null && smallestZ.Post == null)
				{
					layerDone = true;
				}
				else
				{
					evened = true;

					if (smallestZ.Pre == null)
					{
						trash = smallestZ.Post;
						smallestZ.CumX = smallestZ.Post.CumX;
						smallestZ.CumZ = smallestZ.Post.CumZ;
						smallestZ.Post = smallestZ.Post.Post;
						if (smallestZ.Post != null)
						{
							smallestZ.Post.Pre = smallestZ;
						}
					}
					else if (smallestZ.Post == null)
					{
						smallestZ.Pre.Post = null;
						smallestZ.Pre.CumX = smallestZ.CumX;
					}
					else
					{
						if (smallestZ.Pre.CumZ == smallestZ.Post.CumZ)
						{
							smallestZ.Pre.Post = smallestZ.Post.Post;

							if (smallestZ.Post.Post != null)
							{
								smallestZ.Post.Post.Pre = smallestZ.Pre;
							}

							smallestZ.Pre.CumX = smallestZ.Post.CumX;
						}
						else
						{
							smallestZ.Pre.Post = smallestZ.Post;
							smallestZ.Post.Pre = smallestZ.Pre;

							if (smallestZ.Pre.CumZ < smallestZ.Post.CumZ)
							{
								smallestZ.Pre.CumX = smallestZ.CumX;
							}
						}
					}
				}
			}
		}
	}

	/// <summary>
	/// Executes the packing algorithm variants.
	/// </summary>
	function ExecuteIterations(container)
	{
		let itelayer = 0;
		let layersIndex = 0;
		let bestVolume = 0.0;

		for (let containerOrientationVariant = 1; (containerOrientationVariant <= 1) && !quit; containerOrientationVariant++)
		{
			switch (containerOrientationVariant)
			{
				case 1:
					px = container.Length; py = container.Height; pz = container.Width;
					break;

				case 2:
					px = container.Width; py = container.Height; pz = container.Length;
					break;

				case 3:
					px = container.Width; py = container.Length; pz = container.Height;
					break;

				case 4:
					px = container.Height; py = container.Length; pz = container.Width;
					break;

				case 5:
					px = container.Length; py = container.Width; pz = container.Height;
					break;

				case 6:
					px = container.Height; py = container.Width; pz = container.Length;
					break;
			}

			layers.push(new Layer(0, -1));
			ListCanditLayers();
			layers.sort(l => l.LayerEval);

			for (layersIndex = 1; (layersIndex <= layerListLen) && !quit; layersIndex++)
			{
				packedVolume = 0.0;
				packedy = 0;
				packing = true;
				layerThickness = layers[layersIndex].LayerDim;
				itelayer = layersIndex;
				remainpy = py;
				remainpz = pz;
				packedItemCount = 0;

				for (x = 1; x <= itemsToPackCount; x++)
				{
					itemsToPack[x].IsPacked = false;
				}

				do
				{
					layerinlayer = 0;
					layerDone = false;

					PackLayer();

					packedy = packedy + layerThickness;
					remainpy = py - packedy;

					if (layerinlayer != 0 && !quit)
					{
						prepackedy = packedy;
						preremainpy = remainpy;
						remainpy = layerThickness - prelayer;
						packedy = packedy - layerThickness + prelayer;
						remainpz = lilz;
						layerThickness = layerinlayer;
						layerDone = false;

						PackLayer();

						packedy = prepackedy;
						remainpy = preremainpy;
						remainpz = pz;
					}

					FindLayer(remainpy);
				} while (packing && !quit);

				if ((packedVolume > bestVolume) && !quit)
				{
					bestVolume = packedVolume;
					bestVariant = containerOrientationVariant;
					bestIteration = itelayer;
				}

				if (hundredPercentPacked) break;
			}

			if (hundredPercentPacked) break;

			if ((container.Length == container.Height) && (container.Height == container.Width)) containerOrientationVariant = 6;

			layers = [];
		}
	}

	/// <summary>
	/// Finds the most proper boxes by looking at all six possible orientations,
	/// empty space given, adjacent boxes, and pallet limits.
	/// </summary>
	function FindBox(hmx, hy, hmy, hz, hmz)
	{
		let y = 0;
		bfx = 32767;
		bfy = 32767;
		bfz = 32767;
		bbfx = 32767;
		bbfy = 32767;
		bbfz = 32767;
		boxi = 0;
		bboxi = 0;

		for (y = 1; y <= itemsToPackCount; y = y + itemsToPack[y].Quantity)
		{
			for (x = y; x < x + itemsToPack[y].Quantity - 1; x++)
			{
				if (!itemsToPack[x].IsPacked) break;
			}

			if (itemsToPack[x].IsPacked) continue;

			if (x > itemsToPackCount) return;

			AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim1, itemsToPack[x].Dim2, itemsToPack[x].Dim3, 'XYZ');

			if ((itemsToPack[x].Dim1 == itemsToPack[x].Dim3) && (itemsToPack[x].Dim3 == itemsToPack[x].Dim2)) continue;

			AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim1, itemsToPack[x].Dim3, itemsToPack[x].Dim2, 'XZY');
			AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim2, itemsToPack[x].Dim1, itemsToPack[x].Dim3, 'YXZ');
			AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim2, itemsToPack[x].Dim3, itemsToPack[x].Dim1, 'YZX');
			AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim3, itemsToPack[x].Dim1, itemsToPack[x].Dim2, 'ZXY');
			AnalyzeBox(hmx, hy, hmy, hz, hmz, itemsToPack[x].Dim3, itemsToPack[x].Dim2, itemsToPack[x].Dim1, 'ZYX');
		}
	}

	/// <summary>
	/// Finds the most proper layer height by looking at the unpacked boxes and the remaining empty space available.
	/// </summary>
	function FindLayer(thickness)
	{
		let exdim = 0;
		let dimdif;
		let dimen2 = 0;
		let dimen3 = 0;
		let y = 0;
		let z = 0;
		let layereval = 0;
		let eval = 0;
		layerThickness = 0;
		eval = 1000000;

		for (x = 1; x <= itemsToPackCount; x++)
		{
			if (itemsToPack[x].IsPacked) continue;

			for (y = 1; y <= 3; y++)
			{
				switch (y)
				{
					case 1:
						exdim = itemsToPack[x].Dim1;
						dimen2 = itemsToPack[x].Dim2;
						dimen3 = itemsToPack[x].Dim3;
						break;

					case 2:
						exdim = itemsToPack[x].Dim2;
						dimen2 = itemsToPack[x].Dim1;
						dimen3 = itemsToPack[x].Dim3;
						break;

					case 3:
						exdim = itemsToPack[x].Dim3;
						dimen2 = itemsToPack[x].Dim1;
						dimen3 = itemsToPack[x].Dim2;
						break;
				}

				layereval = 0;

				if ((exdim <= thickness) && (((dimen2 <= px) && (dimen3 <= pz)) || ((dimen3 <= px) && (dimen2 <= pz))))
				{
					for (z = 1; z <= itemsToPackCount; z++)
					{
						if (!(x == z) && !(itemsToPack[z].IsPacked))
						{
							dimdif = Math.abs(exdim - itemsToPack[z].Dim1);

							if (Math.abs(exdim - itemsToPack[z].Dim2) < dimdif)
							{
								dimdif = Math.abs(exdim - itemsToPack[z].Dim2);
							}

							if (Math.abs(exdim - itemsToPack[z].Dim3) < dimdif)
							{
								dimdif = Math.abs(exdim - itemsToPack[z].Dim3);
							}

							layereval = layereval + dimdif;
						}
					}

					if (layereval < eval)
					{
						eval = layereval;
						layerThickness = exdim;
					}
				}
			}
		}

		if (layerThickness == 0 || layerThickness > remainpy) packing = false;
	}

	/// <summary>
	/// Finds the first to be packed gap in the layer edge.
	/// </summary>
	function FindSmallestZ()
	{
		let scrapmemb = scrapfirst;
		smallestZ = scrapmemb;

		while (scrapmemb.Post != null)
		{
			if (scrapmemb.Post.CumZ < smallestZ.CumZ)
			{
				smallestZ = scrapmemb.Post;
			}

			scrapmemb = scrapmemb.Post;
		}
	}

	/// <summary>
	/// Initializes everything.
	/// </summary>
	function Initialize(container, items)
	{
		itemsToPack = [];
		itemsPackedInOrder = [];

		// The original code uses 1-based indexing everywhere. This fake entry is added to the beginning
		// of the list to make that possible.
		itemsToPack.push(new Item(0, '', 0, 0, 0, 0));

		layers = [];
		itemsToPackCount = 0;

		for (let j = 0; j < items.length; j++)
		{
			let item = items[j];
			for (let i = 1; i <= item.Quantity; i++)
			{
				let newItem = new Item(item.ID, item.Type, item.Dim1, item.Dim2, item.Dim3, item.Quantity);
				itemsToPack.push(newItem);
			}

			itemsToPackCount += parseInt(item.Quantity);
		}

		itemsToPack.push(new Item(0, '', 0, 0, 0, 0));

		totalContainerVolume = container.Length * container.Height * container.Width;
		totalItemVolume = 0.0;

		for (x = 1; x <= itemsToPackCount; x++)
		{
			totalItemVolume = totalItemVolume + itemsToPack[x].Volume;
		}

		scrapfirst = new ScrapPad();

		scrapfirst.Pre = null;
		scrapfirst.Post = null;
		packingBest = false;
		hundredPercentPacked = false;
		quit = false;
	}

	/// <summary>
	/// Lists all possible layer heights by giving a weight value to each of them.
	/// </summary>
	function ListCanditLayers()
	{
		let same = false;
		let exdim = 0;
		let dimdif;
		let dimen2 = 0;
		let dimen3 = 0;
		let y;
		let z;
		let k;
		let layereval;

		layerListLen = 0;

		for (x = 1; x <= itemsToPackCount; x++)
		{
			for (y = 1; y <= 3; y++)
			{
				switch (y)
				{
					case 1:
						exdim = itemsToPack[x].Dim1;
						dimen2 = itemsToPack[x].Dim2;
						dimen3 = itemsToPack[x].Dim3;
						break;

					case 2:
						exdim = itemsToPack[x].Dim2;
						dimen2 = itemsToPack[x].Dim1;
						dimen3 = itemsToPack[x].Dim3;
						break;

					case 3:
						exdim = itemsToPack[x].Dim3;
						dimen2 = itemsToPack[x].Dim1;
						dimen3 = itemsToPack[x].Dim2;
						break;
				}

				if ((exdim > py) || (((dimen2 > px) || (dimen3 > pz)) && ((dimen3 > px) || (dimen2 > pz)))) continue;

				same = false;

				for (k = 1; k <= layerListLen; k++)
				{
					if (exdim == layers[k].LayerDim)
					{
						same = true;
						continue;
					}
				}

				if (same) continue;

				layereval = 0;

				for (z = 1; z <= itemsToPackCount; z++)
				{
					if (!(x == z))
					{
						dimdif = Math.abs(exdim - itemsToPack[z].Dim1);

						if (Math.abs(exdim - itemsToPack[z].Dim2) < dimdif)
						{
							dimdif = Math.abs(exdim - itemsToPack[z].Dim2);
						}
						if (Math.abs(exdim - itemsToPack[z].Dim3) < dimdif)
						{
							dimdif = Math.abs(exdim - itemsToPack[z].Dim3);
						}
						layereval = layereval + dimdif;
					}
				}

				layerListLen++;

				layers.push(new Layer());
				layers[layerListLen].LayerEval = layereval;
				layers[layerListLen].LayerDim = exdim;
			}
		}
	}

	/// <summary>
	/// Transforms the found coordinate system to the one entered by the user and writes them
	/// to the report file.
	/// </summary>
	function OutputBoxList()
	{
			let packCoordX = 0;
			let packCoordY = 0;
			let packCoordZ = 0;
			let packDimX = 0;
			let packDimY = 0;
			let packDimZ = 0;

		switch (bestVariant)
		{
			case 1:
				packCoordX = itemsToPack[cboxi].CoordX;
				packCoordY = itemsToPack[cboxi].CoordY;
				packCoordZ = itemsToPack[cboxi].CoordZ;
				packDimX = itemsToPack[cboxi].PackDimX;
				packDimY = itemsToPack[cboxi].PackDimY;
				packDimZ = itemsToPack[cboxi].PackDimZ;
				//itemsToPack[cboxi].Orientation = 'XYZ';
				break;

			case 2:
				packCoordX = itemsToPack[cboxi].CoordZ;
				packCoordY = itemsToPack[cboxi].CoordY;
				packCoordZ = itemsToPack[cboxi].CoordX;
				packDimX = itemsToPack[cboxi].PackDimZ;
				packDimY = itemsToPack[cboxi].PackDimY;
				packDimZ = itemsToPack[cboxi].PackDimX;
				//itemsToPack[cboxi].Orientation = 'ZYX';
				break;

			case 3:
				packCoordX = itemsToPack[cboxi].CoordY;
				packCoordY = itemsToPack[cboxi].CoordZ;
				packCoordZ = itemsToPack[cboxi].CoordX;
				packDimX = itemsToPack[cboxi].PackDimY;
				packDimY = itemsToPack[cboxi].PackDimZ;
				packDimZ = itemsToPack[cboxi].PackDimX;
				//itemsToPack[cboxi].Orientation = 'YZX';
				break;

			case 4:
				packCoordX = itemsToPack[cboxi].CoordY;
				packCoordY = itemsToPack[cboxi].CoordX;
				packCoordZ = itemsToPack[cboxi].CoordZ;
				packDimX = itemsToPack[cboxi].PackDimY;
				packDimY = itemsToPack[cboxi].PackDimX;
				packDimZ = itemsToPack[cboxi].PackDimZ;
				//itemsToPack[cboxi].Orientation = 'YXZ';
				break;

			case 5:
				packCoordX = itemsToPack[cboxi].CoordX;
				packCoordY = itemsToPack[cboxi].CoordZ;
				packCoordZ = itemsToPack[cboxi].CoordY;
				packDimX = itemsToPack[cboxi].PackDimX;
				packDimY = itemsToPack[cboxi].PackDimZ;
				packDimZ = itemsToPack[cboxi].PackDimY;
				//itemsToPack[cboxi].Orientation = 'XZY';
				break;

			case 6:
				packCoordX = itemsToPack[cboxi].CoordZ;
				packCoordY = itemsToPack[cboxi].CoordX;
				packCoordZ = itemsToPack[cboxi].CoordY;
				packDimX = itemsToPack[cboxi].PackDimZ;
				packDimY = itemsToPack[cboxi].PackDimX;
				packDimZ = itemsToPack[cboxi].PackDimY;
				//itemsToPack[cboxi].Orientation = 'ZXY';
				break;
		}

		itemsToPack[cboxi].CoordX = packCoordX;
		itemsToPack[cboxi].CoordY = packCoordY;
		itemsToPack[cboxi].CoordZ = packCoordZ;
		itemsToPack[cboxi].PackDimX = packDimX;
		itemsToPack[cboxi].PackDimY = packDimY;
		itemsToPack[cboxi].PackDimZ = packDimZ;

		itemsPackedInOrder.push(itemsToPack[cboxi]);
	}

	/// <summary>
	/// Packs the boxes found and arranges all variables and records properly.
	/// </summary>
	function PackLayer()
	{
			let lenx;
			let lenz;
			let lpz;

		if (layerThickness == 0)
		{
			packing = false;
			return;
		}

		scrapfirst.CumX = px;
		scrapfirst.CumZ = 0;

		for (; !quit;)
		{
			FindSmallestZ();

			if ((smallestZ.Pre == null) && (smallestZ.Post == null))
			{
				//*** SITUATION-1: NO BOXES ON THE RIGHT AND LEFT SIDES ***

				lenx = smallestZ.CumX;
				lpz = remainpz - smallestZ.CumZ;
				FindBox(lenx, layerThickness, remainpy, lpz, lpz);
				CheckFound();

				if (layerDone) break;
				if (evened) continue;

				itemsToPack[cboxi].CoordX = 0;
				itemsToPack[cboxi].CoordY = packedy;
				itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
				if (cboxx == smallestZ.CumX)
				{
					smallestZ.CumZ = smallestZ.CumZ + cboxz;
				}
				else
				{
					smallestZ.Post = new ScrapPad();

					smallestZ.Post.Post = null;
					smallestZ.Post.Pre = smallestZ;
					smallestZ.Post.CumX = smallestZ.CumX;
					smallestZ.Post.CumZ = smallestZ.CumZ;
					smallestZ.CumX = cboxx;
					smallestZ.CumZ = smallestZ.CumZ + cboxz;
				}
			}
			else if (smallestZ.Pre == null)
			{
				//*** SITUATION-2: NO BOXES ON THE LEFT SIDE ***

				lenx = smallestZ.CumX;
				lenz = smallestZ.Post.CumZ - smallestZ.CumZ;
				lpz = remainpz - smallestZ.CumZ;
				FindBox(lenx, layerThickness, remainpy, lenz, lpz);
				CheckFound();

				if (layerDone) break;
				if (evened) continue;

				itemsToPack[cboxi].CoordY = packedy;
				itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
				if (cboxx == smallestZ.CumX)
				{
					itemsToPack[cboxi].CoordX = 0;

					if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ)
					{
						smallestZ.CumZ = smallestZ.Post.CumZ;
						smallestZ.CumX = smallestZ.Post.CumX;
						trash = smallestZ.Post;
						smallestZ.Post = smallestZ.Post.Post;

						if (smallestZ.Post != null)
						{
							smallestZ.Post.Pre = smallestZ;
						}
					}
					else
					{
						smallestZ.CumZ = smallestZ.CumZ + cboxz;
					}
				}
				else
				{
					itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;

					if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ)
					{
						smallestZ.CumX = smallestZ.CumX - cboxx;
					}
					else
					{
						smallestZ.Post.Pre = new ScrapPad();

						smallestZ.Post.Pre.Post = smallestZ.Post;
						smallestZ.Post.Pre.Pre = smallestZ;
						smallestZ.Post = smallestZ.Post.Pre;
						smallestZ.Post.CumX = smallestZ.CumX;
						smallestZ.CumX = smallestZ.CumX - cboxx;
						smallestZ.Post.CumZ = smallestZ.CumZ + cboxz;
					}
				}
			}
			else if (smallestZ.Post == null)
			{
				//*** SITUATION-3: NO BOXES ON THE RIGHT SIDE ***

				lenx = smallestZ.CumX - smallestZ.Pre.CumX;
				lenz = smallestZ.Pre.CumZ - smallestZ.CumZ;
				lpz = remainpz - smallestZ.CumZ;
				FindBox(lenx, layerThickness, remainpy, lenz, lpz);
				CheckFound();

				if (layerDone) break;
				if (evened) continue;

				itemsToPack[cboxi].CoordY = packedy;
				itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
				itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;

				if (cboxx == smallestZ.CumX - smallestZ.Pre.CumX)
				{
					if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.CumX;
						smallestZ.Pre.Post = null;
					}
					else
					{
						smallestZ.CumZ = smallestZ.CumZ + cboxz;
					}
				}
				else
				{
					if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.Pre.CumX + cboxx;
					}
					else
					{
						smallestZ.Pre.Post = new ScrapPad();

						smallestZ.Pre.Post.Pre = smallestZ.Pre;
						smallestZ.Pre.Post.Post = smallestZ;
						smallestZ.Pre = smallestZ.Pre.Post;
						smallestZ.Pre.CumX = smallestZ.Pre.Pre.CumX + cboxx;
						smallestZ.Pre.CumZ = smallestZ.CumZ + cboxz;
					}
				}
			}
			else if (smallestZ.Pre.CumZ == smallestZ.Post.CumZ)
			{
				//*** SITUATION-4: THERE ARE BOXES ON BOTH OF THE SIDES ***

				//*** SUBSITUATION-4A: SIDES ARE EQUAL TO EACH OTHER ***

				lenx = smallestZ.CumX - smallestZ.Pre.CumX;
				lenz = smallestZ.Pre.CumZ - smallestZ.CumZ;
				lpz = remainpz - smallestZ.CumZ;

				FindBox(lenx, layerThickness, remainpy, lenz, lpz);
				CheckFound();

				if (layerDone) break;
				if (evened) continue;

				itemsToPack[cboxi].CoordY = packedy;
				itemsToPack[cboxi].CoordZ = smallestZ.CumZ;

				if (cboxx == smallestZ.CumX - smallestZ.Pre.CumX)
				{
					itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;

					if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.Post.CumX;

						if (smallestZ.Post.Post != null)
						{
							smallestZ.Pre.Post = smallestZ.Post.Post;
							smallestZ.Post.Post.Pre = smallestZ.Pre;
						}
						else
						{
							smallestZ.Pre.Post = null;
						}
					}
					else
					{
						smallestZ.CumZ = smallestZ.CumZ + cboxz;
					}
				}
				else if (smallestZ.Pre.CumX < px - smallestZ.CumX)
				{
					if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ)
					{
						smallestZ.CumX = smallestZ.CumX - cboxx;
						itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;
					}
					else
					{
						itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;
						smallestZ.Pre.Post = new ScrapPad();

						smallestZ.Pre.Post.Pre = smallestZ.Pre;
						smallestZ.Pre.Post.Post = smallestZ;
						smallestZ.Pre = smallestZ.Pre.Post;
						smallestZ.Pre.CumX = smallestZ.Pre.Pre.CumX + cboxx;
						smallestZ.Pre.CumZ = smallestZ.CumZ + cboxz;
					}
				}
				else
				{
					if (smallestZ.CumZ + cboxz == smallestZ.Pre.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.Pre.CumX + cboxx;
						itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;
					}
					else
					{
						itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;
						smallestZ.Post.Pre = new ScrapPad();

						smallestZ.Post.Pre.Post = smallestZ.Post;
						smallestZ.Post.Pre.Pre = smallestZ;
						smallestZ.Post = smallestZ.Post.Pre;
						smallestZ.Post.CumX = smallestZ.CumX;
						smallestZ.Post.CumZ = smallestZ.CumZ + cboxz;
						smallestZ.CumX = smallestZ.CumX - cboxx;
					}
				}
			}
			else
			{
				//*** SUBSITUATION-4B: SIDES ARE NOT EQUAL TO EACH OTHER ***

				lenx = smallestZ.CumX - smallestZ.Pre.CumX;
				lenz = smallestZ.Pre.CumZ - smallestZ.CumZ;
				lpz = remainpz - smallestZ.CumZ;
				FindBox(lenx, layerThickness, remainpy, lenz, lpz);
				CheckFound();

				if (layerDone) break;
				if (evened) continue;

				itemsToPack[cboxi].CoordY = packedy;
				itemsToPack[cboxi].CoordZ = smallestZ.CumZ;
				itemsToPack[cboxi].CoordX = smallestZ.Pre.CumX;

				if (cboxx == (smallestZ.CumX - smallestZ.Pre.CumX))
				{
					if ((smallestZ.CumZ + cboxz) == smallestZ.Pre.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.CumX;
						smallestZ.Pre.Post = smallestZ.Post;
						smallestZ.Post.Pre = smallestZ.Pre;
					}
					else
					{
						smallestZ.CumZ = smallestZ.CumZ + cboxz;
					}
				}
				else
				{
					if ((smallestZ.CumZ + cboxz) == smallestZ.Pre.CumZ)
					{
						smallestZ.Pre.CumX = smallestZ.Pre.CumX + cboxx;
					}
					else if (smallestZ.CumZ + cboxz == smallestZ.Post.CumZ)
					{
						itemsToPack[cboxi].CoordX = smallestZ.CumX - cboxx;
						smallestZ.CumX = smallestZ.CumX - cboxx;
					}
					else
					{
						smallestZ.Pre.Post = new ScrapPad();

						smallestZ.Pre.Post.Pre = smallestZ.Pre;
						smallestZ.Pre.Post.Post = smallestZ;
						smallestZ.Pre = smallestZ.Pre.Post;
						smallestZ.Pre.CumX = smallestZ.Pre.Pre.CumX + cboxx;
						smallestZ.Pre.CumZ = smallestZ.CumZ + cboxz;
					}
				}
			}

			VolumeCheck();
		}
	}

	/// <summary>
	/// Using the parameters found, packs the best solution found and
	/// reports to the console.
	/// </summary>
	function Report(container)
	{
		quit = false;

		switch (bestVariant)
		{
			case 1:
				px = container.Length; py = container.Height; pz = container.Width;
				break;

			case 2:
				px = container.Width; py = container.Height; pz = container.Length;
				break;

			case 3:
				px = container.Width; py = container.Length; pz = container.Height;
				break;

			case 4:
				px = container.Height; py = container.Length; pz = container.Width;
				break;

			case 5:
				px = container.Length; py = container.Width; pz = container.Height;
				break;

			case 6:
				px = container.Height; py = container.Width; pz = container.Length;
				break;
		}

		packingBest = true;

		//Print("BEST SOLUTION FOUND AT ITERATION                      :", bestIteration, "OF VARIANT", bestVariant);
		//Print("TOTAL ITEMS TO PACK                                   :", itemsToPackCount);
		//Print("TOTAL VOLUME OF ALL ITEMS                             :", totalItemVolume);
		//Print("WHILE CONTAINER ORIENTATION X - Y - Z                 :", px, py, pz);

		layers = [];
		layers.push(new Layer(0, -1));
		ListCanditLayers();
		layers.sort(l => l.LayerEval);
		packedVolume = 0;
		packedy = 0;
		packing = true;
		layerThickness = layers[bestIteration].LayerDim;
		remainpy = py;
		remainpz = pz;

		for (x = 1; x <= itemsToPackCount; x++)
		{
			itemsToPack[x].IsPacked = false;
		}

		do
		{
			layerinlayer = 0;
			layerDone = false;
			PackLayer();
			packedy = packedy + layerThickness;
			remainpy = py - packedy;

			if (layerinlayer > 0.0001)
			{
				prepackedy = packedy;
				preremainpy = remainpy;
				remainpy = layerThickness - prelayer;
				packedy = packedy - layerThickness + prelayer;
				remainpz = lilz;
				layerThickness = layerinlayer;
				layerDone = false;
				PackLayer();
				packedy = prepackedy;
				remainpy = preremainpy;
				remainpz = pz;
			}

			if (!quit)
			{
				FindLayer(remainpy);
			}
		} while (packing && !quit);
	}

	/// <summary>
	/// After packing of each item, the 100% packing condition is checked.
	/// </summary>
	function VolumeCheck()
	{
		itemsToPack[cboxi].IsPacked = true;
		itemsToPack[cboxi].PackDimX = cboxx;
		itemsToPack[cboxi].PackDimY = cboxy;
		itemsToPack[cboxi].PackDimZ = cboxz;
		itemsToPack[cboxi].Orientation = corient;
		packedVolume = packedVolume + itemsToPack[cboxi].Volume;
		packedItemCount++;

		if (packingBest)
		{
			OutputBoxList();
		}
		else if (packedVolume == totalContainerVolume || packedVolume == totalItemVolume)
		{
			packing = false;
			hundredPercentPacked = true;
		}
	}

	//}
	/// <summary>
	/// A list that stores all the different lengths of all item dimensions.
	/// From the master's thesis:
	/// "Each Layerdim value in this array represents a different layer thickness
	/// value with which each iteration can start packing. Before starting iterations,
	/// all different lengths of all box dimensions along with evaluation values are
	/// stored in this array" (p. 3-6).
	/// </summary>
	class Layer
	{
		/// <summary>
		/// Gets or sets the layer dimension value, representing a layer thickness.
		/// </summary>
		/// <value>
		/// The layer dimension value.
		/// </value>
		LayerDim = 0;

		/// <summary>
		/// Gets or sets the layer eval value, representing an evaluation weight
		/// value for the corresponding LayerDim value.
		/// </summary>
		/// <value>
		/// The layer eval value.
		/// </value>
		LayerEval = -1;
		
		constructor(dim, ev) {
			this.LayerDim = dim;
			this.LayerEval = ev;
		}
	}

    /// <summary>
	/// The container to pack items into.
	/// </summary>
	class Container
	{
		/// <summary>
		/// Initializes a new instance of the Container class.
		/// </summary>
		/// <param name="id">The container ID.</param>
		/// <param name="length">The container length.</param>
		/// <param name="width">The container width.</param>
		/// <param name="height">The container height.</param>
		constructor(id, length, width, height)
		{
			this.ID = id;
			this.Length = parseInt(length);
			this.Width = parseInt(width);
			this.Height = parseInt(height);
			this.Volume = this.Length * this.Width * this.Height;
		}

		/// <summary>
		/// Gets or sets the container ID.
		/// </summary>
		/// <value>
		/// The container ID.
		/// </value>
		ID = 0;

		/// <summary>
		/// Gets or sets the container length.
		/// </summary>
		/// <value>
		/// The container length.
		/// </value>
		Length = 0;

		/// <summary>
		/// Gets or sets the container width.
		/// </summary>
		/// <value>
		/// The container width.
		/// </value>
		Width = 0;

		/// <summary>
		/// Gets or sets the container height.
		/// </summary>
		/// <value>
		/// The container height.
		/// </value>
		Height = 0;

		/// <summary>
		/// Gets or sets the volume of the container.
		/// </summary>
		/// <value>
		/// The volume of the container.
		/// </value>
		Volume = 0;
	}

    class ContainerPackingResult
	{
		constructor()
		{
			this.AlgorithmPackingResults = [];
		}

		/// <summary>
		/// Gets or sets the container ID.
		/// </summary>
		/// <value>
		/// The container ID.
		/// </value>
		ContainerID = 0;

		AlgorithmPackingResults = null;
	}

    class Item
	{
		/// <summary>
		/// Initializes a new instance of the Item class.
		/// </summary>
		/// <param name="id">The item ID.</param>
		/// <param name="dim1">The length of one of the three item dimensions.</param>
		/// <param name="dim2">The length of another of the three item dimensions.</param>
		/// <param name="dim3">The length of the other of the three item dimensions.</param>
		/// <param name="itemQuantity">The item quantity.</param>
		constructor(id, type, dim1, dim2, dim3, quantity)
		{
			this.ID = id;
			this.Type = type;
			this.Dim1 = parseInt(dim1);
			this.Dim2 = parseInt(dim2);
			this.Dim3 = parseInt(dim3);
			this.Volume = this.Dim1 * this.Dim2 * this.Dim3;
			this.Quantity = parseInt(quantity);
		}

		/// <summary>
		/// Gets or sets the item ID.
		/// </summary>
		/// <value>
		/// The item ID.
		/// </value>
		ID = 0;

		/// <summary>
		/// Gets or sets a value indicating whether this item has already been packed.
		/// </summary>
		/// <value>
		///   True if the item has already been packed; otherwise, false.
		/// </value>
		IsPacked = false;

		/// <summary>
		/// Gets or sets the type of item.
		/// </summary>
		/// <value>
		/// Type.
		/// </value>
		Type = '';

		/// <summary>
		/// Gets or sets the length of one of the item dimensions.
		/// </summary>
		/// <value>
		/// The first item dimension.
		/// </value>
		Dim1 = 0;

		/// <summary>
		/// Gets or sets the length another of the item dimensions.
		/// </summary>
		/// <value>
		/// The second item dimension.
		/// </value>
		Dim2 = 0;

		/// <summary>
		/// Gets or sets the third of the item dimensions.
		/// </summary>
		/// <value>
		/// The third item dimension.
		/// </value>
		Dim3 = 0;

		/// <summary>
		/// Gets or sets the x coordinate of the location of the packed item within the container.
		/// </summary>
		/// <value>
		/// The x coordinate of the location of the packed item within the container.
		/// </value>
		CoordX = 0;

		/// <summary>
		/// Gets or sets the y coordinate of the location of the packed item within the container.
		/// </summary>
		/// <value>
		/// The y coordinate of the location of the packed item within the container.
		/// </value>
		CoordY = 0;

		/// <summary>
		/// Gets or sets the z coordinate of the location of the packed item within the container.
		/// </summary>
		/// <value>
		/// The z coordinate of the location of the packed item within the container.
		/// </value>
		CoordZ = 0;

		/// <summary>
		/// Gets or sets the item quantity.
		/// </summary>
		/// <value>
		/// The item quantity.
		/// </value>
		Quantity = 1;

		/// <summary>
		/// Gets or sets the packed orientation of item.
		/// </summary>
		/// <value>
		/// one of XYZ, XZY, YXZ, ZXY, XZY, ZYX.
		/// </value>
		Orientation = 'XYZ';

		/// <summary>
		/// Gets or sets the x dimension of the orientation of the item as it has been packed.
		/// </summary>
		/// <value>
		/// The x dimension of the orientation of the item as it has been packed.
		/// </value>
		PackDimX = 0;

		/// <summary>
		/// Gets or sets the y dimension of the orientation of the item as it has been packed.
		/// </summary>
		/// <value>
		/// The y dimension of the orientation of the item as it has been packed.
		/// </value>
		PackDimY = 0;

		/// <summary>
		/// Gets or sets the z dimension of the orientation of the item as it has been packed.
		/// </summary>
		/// <value>
		/// The z dimension of the orientation of the item as it has been packed.
		/// </value>
		PackDimZ = 0;

		/// <summary>
		/// Gets the item volume.
		/// </summary>
		/// <value>
		/// The item volume.
		/// </value>
		Volume = 0;
	}

    let result = [];

    containers.forEach(container =>
    {
        let containerPackingResult = new ContainerPackingResult();
        containerPackingResult.ContainerID = container.ID;

        let items = [];

        packingList.forEach(item =>
        {
            items.push(new Item(item.ID, item.Type, item.Dim1, item.Dim2, item.Dim3, item.Quantity));
        });

        let stopwatch = performance.now();
        let algorithmResult = Run(container, items);
        stopwatch = performance.now() - stopwatch;

        algorithmResult.PackTimeInMilliseconds = stopwatch;

        let containerVolume = container.Length * container.Width * container.Height;
        let itemVolumePacked = 0;
        algorithmResult.PackedItems.forEach(i => itemVolumePacked += i.Volume);
        let itemVolumeUnpacked = 0;
        algorithmResult.UnpackedItems.forEach(i => itemVolumeUnpacked += i.Volume);

        algorithmResult.PercentContainerVolumePacked = Math.round(itemVolumePacked / containerVolume * 100, 2);
        algorithmResult.PercentItemVolumePacked = Math.round(itemVolumePacked / (itemVolumePacked + itemVolumeUnpacked) * 100, 2);

        containerPackingResult.AlgorithmPackingResults.push(algorithmResult);

        result.push(containerPackingResult);
    });
    
    return result;
}
