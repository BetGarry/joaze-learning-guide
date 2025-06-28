import {
    AssetExporterPlugin,
    BloomPlugin,
    CoreViewerApp,
    DepthOfFieldPlugin,
    DiamondPlugin,
    FileTransferPlugin,
    GroundPlugin,
    HierarchyUiPlugin,
    OutlinePlugin,
    PickingPlugin,
    RandomizedDirectionalLightPlugin,
    SimpleBackgroundEnvUiPlugin,
    SSAOPlugin,
    SSRPlugin,
    TonemapPlugin,
    TweakpaneUiPlugin
} from 'webgi'
import {ParameterUI} from './ParameterUI'

export async function setupDebugUi(
    viewer: CoreViewerApp,
    isMobile: boolean,
    paramsUi: ParameterUI,
    paramsDiv: HTMLDivElement
) {
    // Clear any existing UI elements that might have been added before
    const existingUiPlugin = viewer.getPlugin(TweakpaneUiPlugin);
    if (existingUiPlugin) {
        try {
            await viewer.removePlugin(existingUiPlugin);
        } catch (error) {
            console.warn('Error removing existing UI plugin:', error);
        }
    }

    // Remove any leftover Tweakpane containers from previous sessions
    document.querySelectorAll('.tp-container').forEach(el => el.remove());
    document.querySelectorAll('.tp-root').forEach(el => el.remove());
    document.querySelectorAll('.tp-rotv').forEach(el => el.remove());
    document.querySelectorAll('#tweakpaneUiContainer').forEach(el => el.remove());

    // await viewer.addPlugin(new PickingPlugin(BoxSelectionWidget, false, true));
    await viewer.addPlugin(SimpleBackgroundEnvUiPlugin)
    await viewer.addPlugin(FileTransferPlugin)
    await viewer.addPlugin(AssetExporterPlugin)
    await viewer.addPlugin(HierarchyUiPlugin)

    const picking = await viewer.addPlugin(new PickingPlugin());
    picking.enabled = false;
    await viewer.addPlugin(OutlinePlugin)
    viewer.renderer.refreshPipeline()

    // Clear the paramsDiv completely before adding new UI
    paramsDiv.innerHTML = '';
    paramsDiv.className = 'shapediver-params-container';

    // Create a new container specifically for the ShapeDiver parameters
    const container = document.createElement('div');
    container.id = 'tweakpaneUiContainer';
    container.style.width = '100%';
    paramsDiv.appendChild(container);

    const uiPlugin = await viewer.addPlugin(new TweakpaneUiPlugin(!isMobile));
    uiPlugin.colorMode = 'white'

    uiPlugin.appendUiObject(paramsUi);
    
    console.log('UI plugin created and parameters appended to container');
} 